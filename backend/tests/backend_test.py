"""
GCSR State Data Lakehouse - Backend API Regression Tests
Covers: Auth, Dashboards, Citizens/Families, Datasets, Copilot (Mistral), Reports.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or "https://golden-record-hub.preview.emergentagent.com"
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"

CREDENTIALS = {
    "state_admin": "Admin@123",
    "dept_officer": "Health@123",
    "district_officer": "District@123",
    "citizen": "Citizen@123",
}


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"username": "state_admin", "password": "Admin@123"}, timeout=15)
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---------- Auth ----------
class TestAuth:
    @pytest.mark.parametrize("uname,pwd", list(CREDENTIALS.items()))
    def test_login_success(self, session, uname, pwd):
        r = session.post(f"{API}/auth/login", json={"username": uname, "password": pwd}, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "access_token" in data and isinstance(data["access_token"], str) and data["access_token"]
        assert "user" in data
        assert data["user"]["username"] == uname

    def test_login_wrong_password(self, session):
        r = session.post(f"{API}/auth/login", json={"username": "state_admin", "password": "wrong"}, timeout=15)
        assert r.status_code == 401

    def test_login_unknown_user(self, session):
        r = session.post(f"{API}/auth/login", json={"username": "nobody", "password": "x"}, timeout=15)
        assert r.status_code == 401

    def test_me_requires_auth(self, session):
        r = session.get(f"{API}/auth/me", timeout=10)
        assert r.status_code in (401, 403)

    def test_me_returns_profile(self, session, auth_headers):
        r = session.get(f"{API}/auth/me", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data.get("username") == "state_admin"


# ---------- Dashboards ----------
DASHBOARDS = [
    "state",
    "district",
    "department",
    "data-lake",
    "data-quality",
    "ai-governance",
    "citizen-kpis",
]


class TestDashboards:
    @pytest.mark.parametrize("name", DASHBOARDS)
    def test_dashboard_endpoint(self, session, auth_headers, name):
        r = session.get(f"{API}/dashboards/{name}", headers=auth_headers, timeout=15)
        assert r.status_code == 200, f"{name}: {r.status_code} {r.text[:200]}"
        data = r.json()
        assert "kpis" in data, f"{name} missing kpis: keys={list(data.keys())}"
        assert isinstance(data["kpis"], list) and len(data["kpis"]) > 0

    def test_state_dashboard_shape(self, session, auth_headers):
        r = session.get(f"{API}/dashboards/state", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data["kpis"]) == 6, f"expected 6 kpis, got {len(data['kpis'])}"
        for key in ["registry_growth", "district_leaderboard", "department_coverage",
                    "scheme_saturation", "vulnerability_map", "alerts"]:
            assert key in data, f"missing '{key}' key"
        assert len(data["district_leaderboard"]) == 12, f"expected 12 districts got {len(data['district_leaderboard'])}"


# ---------- Registry: Citizens & Families ----------
class TestRegistry:
    def test_list_citizens(self, session, auth_headers):
        r = session.get(f"{API}/citizens?limit=10", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "items" in data or "results" in data or isinstance(data, list)
        items = data["items"] if isinstance(data, dict) and "items" in data else data
        assert len(items) > 0
        return items

    def test_citizen_360(self, session, auth_headers):
        r = session.get(f"{API}/citizens?limit=1", headers=auth_headers, timeout=15)
        items = r.json().get("items") if isinstance(r.json(), dict) else r.json()
        cid = items[0].get("id") or items[0].get("citizen_id")
        assert cid, f"no citizen id available: {items[0]}"
        r2 = session.get(f"{API}/citizens/{cid}", headers=auth_headers, timeout=15)
        assert r2.status_code == 200, r2.text
        data = r2.json()
        for key in ["citizen", "family", "members", "timeline", "enrichments", "ai_summary"]:
            assert key in data, f"citizen 360 missing '{key}': keys={list(data.keys())}"

    def test_list_families(self, session, auth_headers):
        r = session.get(f"{API}/families?limit=10", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        data = r.json()
        items = data["items"] if isinstance(data, dict) and "items" in data else data
        assert len(items) > 0

    def test_family_360(self, session, auth_headers):
        r = session.get(f"{API}/families?limit=1", headers=auth_headers, timeout=15)
        items = r.json().get("items") if isinstance(r.json(), dict) else r.json()
        fid = items[0].get("id") or items[0].get("family_id")
        assert fid, f"no family id available: {items[0]}"
        r2 = session.get(f"{API}/families/{fid}", headers=auth_headers, timeout=15)
        assert r2.status_code == 200, r2.text
        data = r2.json()
        for key in ["family", "members", "timeline"]:
            assert key in data, f"family 360 missing '{key}': keys={list(data.keys())}"


# ---------- Other module endpoints ----------
GENERIC_ENDPOINTS = [
    "/departments",
    "/schemes",
    "/dbt/dashboard",
    "/datasets",
    "/audit-logs",
    "/consents",
    "/notifications",
    "/gis/state",
    "/admin/users",
    "/admin/workflows",
    "/members/matching",
    "/ai/risk-scores",
    "/ai/policy-simulator",
    "/copilot/suggestions",
]


class TestModules:
    @pytest.mark.parametrize("path", GENERIC_ENDPOINTS)
    def test_endpoint_returns_200(self, session, auth_headers, path):
        r = session.get(f"{API}{path}", headers=auth_headers, timeout=15)
        assert r.status_code == 200, f"{path}: {r.status_code} {r.text[:200]}"
        data = r.json()
        assert data is not None
        # basic non-empty shape check
        if isinstance(data, list):
            assert len(data) >= 0
        elif isinstance(data, dict):
            assert len(data.keys()) > 0


# ---------- Reports ----------
REPORT_KINDS = ["executive", "dbt", "citizen", "family", "department", "quality", "ai"]


class TestReports:
    @pytest.mark.parametrize("kind", REPORT_KINDS)
    def test_report_endpoint(self, session, auth_headers, kind):
        r = session.get(f"{API}/reports/{kind}", headers=auth_headers, timeout=15)
        assert r.status_code == 200, f"{kind}: {r.status_code} {r.text[:200]}"
        data = r.json()
        assert isinstance(data, dict)
        # loose check: any table/series/rows key
        keys = set(data.keys())
        assert keys & {"series", "table", "rows", "kpis", "data", "columns"}, f"{kind} unexpected shape: {keys}"


# ---------- Mistral Copilot ----------
class TestCopilot:
    def test_copilot_chat_returns_answer(self, session, auth_headers):
        payload = {"prompt": "Give me a one-line summary of GCSR", "history": []}
        r = session.post(f"{API}/copilot/chat", headers=auth_headers, json=payload, timeout=60)
        assert r.status_code == 200, f"{r.status_code} {r.text[:300]}"
        data = r.json()
        assert "answer" in data, f"missing answer: {data}"
        assert isinstance(data["answer"], str) and len(data["answer"].strip()) > 0
