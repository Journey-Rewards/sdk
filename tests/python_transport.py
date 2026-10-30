import sys
from journey_rewards import JourneyClient, JourneyMemberClient, JourneyMcpClient, JourneyError

url = sys.argv[1]
client = JourneyClient(api_key="jny_python", base_url=url)
assert client.request("loyaltyProgramsPartner_list")["key"] == "jny_python"
assert JourneyClient(access_token="workos_py", base_url=url).request("loyaltyProgramsPartner_list")["authorization"] == "Bearer workos_py"
member = JourneyMemberClient(access_token="clerk_py", base_url=url)
assert member.request("memberProfile_get", query={"fields": ["additionalInfo"]})["url"] == "/v1/members/me/profile?fields=additionalInfo"
for operation, options in [
    ("memberProfile_get", {}),
    ("loyaltyProgramsPartner_get", {"path": {"externalId": ".."}}),
    ("loyaltyProgramsPartner_create", {"body": {"name": "No key"}}),
    ("loyaltyProgramsPartner_list", {"query": {"unsupported": True}}),
]:
    try:
        client.request(operation, **options)
        raise AssertionError("Invalid request was accepted")
    except ValueError:
        pass
request = dict(body={"name": "Python fixture"}, idempotency_key="test-python-draft")
assert client.request("loyaltyProgramsPartner_create", **request) == client.request("loyaltyProgramsPartner_create", **request)
try:
    client.request("loyaltyProgramsPartner_create", body={"name": "Changed"}, idempotency_key="test-python-draft")
    raise AssertionError("Conflict not detected")
except JourneyError as error:
    assert error.status == 409
for mode, code in [("429", 429), ("503", 503), ("invalid", "invalid_response"), ("redirect", 307), ("broken", "transport_error")]:
    try:
        client.request("loyaltyProgramsPartner_list", query={"organizationId": mode})
        raise AssertionError("Failure not detected")
    except JourneyError as error:
        assert error.code == code, (mode, error.code)
        if mode in ("429", "503"):
            assert error.retry_after == "17" and error.request_id == "req_fixture"
try:
    JourneyClient(api_key="jny_timeout", base_url=url, timeout=.02).request("loyaltyProgramsPartner_list", query={"organizationId": "slow"})
    raise AssertionError("Timeout not detected")
except JourneyError as error:
    assert error.code == "transport_error"
mcp = JourneyMcpClient(endpoint=url+"/api/mcp", access_token="mcp_py")
assert mcp.list_tools()["tools"] == []
for name, code in [("fail", "MEMBER_AUTH_REQUIRED"), ("rpc-fail", -32601), ("wrong-id", "invalid_response")]:
    try:
        mcp.call_tool(name)
        raise AssertionError("MCP error not detected")
    except JourneyError as error:
        assert error.code == code
print("Python transport fixtures passed")

# Accidental diagnostics must not disclose credentials. Explicit memory access
# by code in the same process is outside this guarantee.
import json, pickle
for current, secret in [(client,"jny_python"),(member,"clerk_py"),(mcp,"mcp_py")]:
    assert secret not in repr(current)
    for serialize in [vars, pickle.dumps]:
        try:
            serialize(current)
            raise AssertionError("Credential-bearing client was serialized")
        except TypeError:
            pass
for mode in ["echo-secret", "invalid-secret"]:
    try:
        client.request("loyaltyProgramsPartner_list", query={"organizationId":mode})
        raise AssertionError("Expected HTTP error")
    except JourneyError as error:
        assert "jny_python" not in str(error) + repr(vars(error))
try:
    mcp.call_tool("echo-secret")
    raise AssertionError("Expected MCP error")
except JourneyError as error:
    assert "mcp_py" not in str(error) + repr(vars(error))
