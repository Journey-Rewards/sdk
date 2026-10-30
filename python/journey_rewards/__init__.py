"""Official Journey Core REST and MCP clients. No automatic retries."""
from __future__ import annotations

import json
import math
import re
from importlib.resources import files
from typing import Any, Mapping
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urlsplit
from urllib.request import Request, HTTPRedirectHandler, build_opener
from http.client import HTTPException

__version__ = "2.0.1"
operations = json.loads(files(__package__).joinpath("operations.json").read_text())
_UNSET = object()


class JourneyError(Exception):
    def __init__(self, message: str, *, status: int = 0, code: str | int | None = None,
                 details: Any = None, retry_after: str | None = None,
                 request_id: str | None = None, payload: Any = None):
        super().__init__(message)
        self.status, self.code, self.details = status, code, details
        self.retry_after, self.request_id, self.payload = retry_after, request_id, payload


class _NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def _url(value: str, origin: bool = False) -> str:
    u = urlsplit(value)
    if not u.hostname or u.username or u.password or u.query or u.fragment or (
        u.scheme != "https" and not (u.scheme == "http" and u.hostname in ("localhost", "127.0.0.1", "::1"))
    ):
        raise ValueError("Use HTTPS or loopback HTTP without credentials, query or fragment in the URL.")
    if origin and u.path not in ("", "/"):
        raise ValueError("Core base_url is an origin without /v1; operations include the version.")
    return value.rstrip("/") if origin else value


def _credential(value: str | None, label: str) -> str:
    if not isinstance(value, str) or not value.strip() or "\r" in value or "\n" in value:
        raise ValueError(f"{label} must be a nonempty credential.")
    return value


def _send(url: str, method: str, headers: dict, body: Any, timeout: float) -> Any:
    data = None if body is _UNSET else json.dumps(body, allow_nan=False).encode()
    request = Request(url, data=data, headers={
        "User-Agent": f"JourneySDK-Python/{__version__} (+https://github.com/Journey-Rewards/sdk)",
        **headers,
    }, method=method)
    try:
        response = build_opener(_NoRedirect).open(request, timeout=timeout)
    except HTTPError as error:
        response = error
    except (URLError, OSError) as error:
        raise JourneyError("Journey request failed. The outcome may be unknown; no automatic retry was attempted.", code="transport_error") from error
    with response:
        status, response_headers = response.code, response.headers
        try:
            raw = response.read()
            payload = json.loads(raw) if raw else None
        except (OSError, HTTPException) as error:
            raise JourneyError("Journey response was interrupted. The outcome may be unknown; no automatic retry was attempted.", status=status, code="transport_error") from error
        except (ValueError, UnicodeError) as error:
            raise JourneyError("Journey returned a non-JSON response.", status=status, code="invalid_response", retry_after=response_headers.get("Retry-After")) from error
    if not 200 <= status < 300:
        error = payload.get("error", payload) if isinstance(payload, dict) else {}
        if not isinstance(error, dict): error = {}
        raise JourneyError(error.get("message", f"Journey HTTP {status}"), status=status,
                           code=error.get("code", status), details=error.get("details", error.get("errors")),
                           retry_after=response_headers.get("Retry-After"), request_id=response_headers.get("X-Request-Id"), payload=payload)
    return payload


class _RestClient:
    def __init__(self, surface: str, headers: dict, *, base_url: str = "https://api-prd.cf.journey.com", timeout: float = 30):
        self.base_url = _url(base_url, origin=True)
        if not isinstance(timeout, (int, float)) or not math.isfinite(timeout) or timeout <= 0:
            raise ValueError("timeout must be a positive finite number.")
        self.surface, self.headers, self.timeout = surface, headers, timeout

    def request(self, operation_id: str, *, path: Mapping[str, str | int] | None = None,
                query: Mapping[str, Any] | None = None, body: Any = _UNSET,
                idempotency_key: str | None = None) -> Any:
        operation = operations.get(operation_id)
        if not operation or operation["surface"] != self.surface:
            raise ValueError(f"Unknown {self.surface} operation: {operation_id}")
        path, query = {} if path is None else path, {} if query is None else query
        if not isinstance(path, Mapping) or not isinstance(query, Mapping): raise ValueError("path and query must be mappings.")
        expected = re.findall(r"\{([^}]+)\}", operation["path"])
        if set(path) - set(expected): raise ValueError("Unknown path parameter.")
        def replacement(match):
            name, value = match.group(1), path.get(match.group(1))
            if not isinstance(value, (str, int)) or isinstance(value, bool) or not str(value) or re.search(r"[/\\%\x00-\x1f]", str(value)) or str(value) in (".", ".."):
                raise ValueError(f"Invalid path parameter: {name}")
            return quote(str(value), safe="")
        pathname = re.sub(r"\{([^}]+)\}", replacement, operation["path"])
        params = []
        for name, value in query.items():
            if name not in operation["query"]: raise ValueError(f"Unknown query parameter: {name}")
            for item in value if isinstance(value, (list, tuple)) else [value]:
                if item is None: continue
                if not isinstance(item, (str, int, float, bool)) or isinstance(item, float) and not math.isfinite(item):
                    raise ValueError(f"Invalid query parameter: {name}")
                params.append((name, str(item).lower() if isinstance(item, bool) else str(item)))
        for name in operation["requiredQuery"]:
            if not any(key == name for key, _ in params): raise ValueError(f"Required query parameter: {name}")
        headers = {"Accept": "application/json", **self.headers}
        if operation["method"] not in ("GET", "HEAD"):
            if not isinstance(idempotency_key, str) or not re.fullmatch(r"[\x21-\x7e]{1,255}", idempotency_key):
                raise ValueError("Partner writes require an explicit Idempotency-Key (1–255 visible ASCII characters).")
            headers["Idempotency-Key"] = idempotency_key
        elif body is not _UNSET or idempotency_key is not None:
            raise ValueError("Read operations do not accept a body or idempotency key.")
        if operation["bodyRequired"] and body is _UNSET: raise ValueError("This operation requires a request body.")
        if not operation["hasBody"] and body is not _UNSET: raise ValueError("This operation does not accept a request body.")
        if body is not _UNSET: headers["Content-Type"] = "application/json"
        return _send(self.base_url + pathname + ("?" + urlencode(params) if params else ""), operation["method"], headers, body, self.timeout)


class JourneyClient(_RestClient):
    def __init__(self, *, api_key: str | None = None, access_token: str | None = None, **options):
        if bool(api_key) == bool(access_token): raise ValueError("Provide exactly one partner api_key or WorkOS access_token.")
        if api_key and not api_key.startswith("jny_"): raise ValueError("Partner keys begin with jny_; Hive jh_ keys are incompatible.")
        headers = {"X-API-Key": _credential(api_key, "api_key")} if api_key else {"Authorization": "Bearer " + _credential(access_token, "access_token")}
        super().__init__("partner", headers, **options)


JourneyPartnerClient = JourneyClient


class JourneyMemberClient(_RestClient):
    def __init__(self, *, access_token: str, **options):
        super().__init__("member", {"Authorization": "Bearer " + _credential(access_token, "member Clerk access_token")}, **options)


class JourneyMcpClient:
    def __init__(self, *, endpoint: str = "https://www.journey.com/api/mcp", access_token: str | None = None, timeout: float = 30):
        if not isinstance(timeout, (int, float)) or not math.isfinite(timeout) or timeout <= 0:
            raise ValueError("timeout must be a positive finite number.")
        self.endpoint, self.timeout = _url(endpoint), timeout
        self.token = _credential(access_token, "MCP OAuth access_token") if access_token else None
        self.next_id = 0

    def request(self, method: str, params: dict | None = None) -> Any:
        self.next_id += 1
        headers = {"Content-Type": "application/json", "Accept": "application/json, text/event-stream", "Journey-API-Version": "1"}
        if self.token: headers["Authorization"] = "Bearer " + self.token
        payload = _send(self.endpoint, "POST", headers, {"jsonrpc": "2.0", "id": self.next_id, "method": method, "params": params or {}}, self.timeout)
        if not isinstance(payload, dict) or payload.get("jsonrpc") != "2.0" or payload.get("id") != self.next_id:
            raise JourneyError("Invalid JSON-RPC response.", code="invalid_response", payload=payload)
        if payload.get("error"):
            raise JourneyError(payload["error"].get("message", "JSON-RPC error"), code=payload["error"].get("code"), payload=payload)
        result = payload.get("result")
        if isinstance(result, dict) and result.get("isError"):
            error = result.get("structuredContent", {}).get("error", {})
            raise JourneyError(error.get("message", "Journey tool failed."), code=error.get("code", "tool_error"), payload=payload)
        return result

    def list_tools(self) -> Any:
        return self.request("tools/list")

    def call_tool(self, name: str, arguments: dict | None = None) -> Any:
        return self.request("tools/call", {"name": name, "arguments": arguments or {}})
