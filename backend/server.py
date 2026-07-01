"""Backend server: routers for GCSR State Data Lakehouse PoC."""
import os
import random
import uuid
import logging
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, APIRouter, Depends, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from app.auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, RoleChecker, TokenUser,
)
from app.mistral_client import chat_completion
from app.seed import seed_all, GUJARAT_DISTRICTS, DEPARTMENTS, SCHEMES

# ---------- infra ----------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="GCSR - State Data Lakehouse", version="1.0.0")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("gcsr")


@app.on_event("startup")
async def on_startup():
    await seed_all(db)
    log.info("GCSR seed data ready.")


# ================================================================
#                       AUTH
# ================================================================
class LoginReq(BaseModel):
    username: str
    password: str


class LoginResp(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict
    mfa_required: bool = False
    demo_otp: Optional[str] = None


@api.post("/auth/login", response_model=LoginResp)
async def login(body: LoginReq):
    user = await db.users.find_one({"username": body.username}, {"_id": 0})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    pub = {
        "id": user["id"], "username": user["username"], "email": user["email"],
        "full_name": user["full_name"], "role": user["role"],
        "department": user.get("department"), "district": user.get("district"),
        "designation": user.get("designation"),
    }
    token = create_access_token({"user": {k: pub[k] for k in ["id","username","email","full_name","role","department","district"]}})
    return LoginResp(access_token=token, user=pub, mfa_required=False, demo_otp="482913")


@api.post("/auth/verify-mfa")
async def verify_mfa(otp: str = Body(..., embed=True)):
    if otp not in ("482913", "000000"):
        raise HTTPException(status_code=401, detail="Invalid OTP")
    return {"ok": True}


@api.get("/auth/me")
async def me(user: TokenUser = Depends(get_current_user)):
    doc = await db.users.find_one({"id": user.id}, {"_id": 0, "password_hash": 0})
    return doc or user.model_dump()


@api.post("/auth/forgot-password")
async def forgot_password(email: str = Body(..., embed=True)):
    return {"ok": True, "message": f"Password reset link sent to {email}"}


@api.post("/auth/logout")
async def logout(user: TokenUser = Depends(get_current_user)):
    return {"ok": True}


@api.get("/auth/sessions")
async def sessions(user: TokenUser = Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    return {
        "sessions": [
            {"id": "sess-cur", "device": "Chrome / macOS", "ip": "203.0.113.14", "location": "Gandhinagar, GJ",
             "started": (now - timedelta(hours=2)).isoformat(), "current": True},
            {"id": "sess-m1", "device": "iOS App / iPhone", "ip": "203.0.113.55", "location": "Ahmedabad, GJ",
             "started": (now - timedelta(days=1)).isoformat(), "current": False},
            {"id": "sess-w2", "device": "Edge / Windows", "ip": "203.0.113.90", "location": "Vadodara, GJ",
             "started": (now - timedelta(days=3)).isoformat(), "current": False},
        ]
    }


# ================================================================
#                       DASHBOARDS
# ================================================================
def _series(n: int, base: int, jitter: float = 0.15):
    out = []
    v = base
    for _ in range(n):
        v = max(1, int(v * (1 + random.uniform(-jitter, jitter))))
        out.append(v)
    return out


@api.get("/dashboards/state")
async def dashboard_state(user: TokenUser = Depends(get_current_user)):
    random.seed(1)
    months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]
    return {
        "kpis": [
            {"key": "citizens", "label": "Citizens on Registry", "value": "6.42 Cr", "change": 2.4, "icon": "Users", "color": "primary"},
            {"key": "families", "label": "Golden Families", "value": "1.38 Cr", "change": 3.1, "icon": "Home", "color": "secondary"},
            {"key": "dq", "label": "Data Quality Index", "value": "94.2%", "change": 0.8, "icon": "ShieldCheck", "color": "accent"},
            {"key": "dbt", "label": "DBT Disbursed (FY)", "value": "₹ 48,392 Cr", "change": 12.4, "icon": "Banknote", "color": "success"},
            {"key": "leakage", "label": "Welfare Leakage", "value": "1.82%", "change": -0.6, "icon": "AlertTriangle", "color": "warning"},
            {"key": "depts", "label": "Departments Integrated", "value": "42 / 46", "change": 4.7, "icon": "Network", "color": "primary"},
        ],
        "registry_growth": [{"month": m, "citizens": v, "families": v // 4}
                            for m, v in zip(months, _series(len(months), 5_800_000))],
        "district_leaderboard": [
            {"district": d, "coverage": round(random.uniform(60, 97), 1),
             "families": random.randint(120_000, 1_800_000),
             "dq": round(random.uniform(0.72, 0.98), 3)}
            for d in random.sample(GUJARAT_DISTRICTS, 12)
        ],
        "department_coverage": [
            {"dept": d["name"], "coverage": round(random.uniform(45, 95), 1), "families": random.randint(200_000, 8_000_000)}
            for d in DEPARTMENTS
        ],
        "scheme_saturation": [
            {"scheme": s["code"], "name": s["name"], "saturation": round(random.uniform(35, 95), 1)}
            for s in SCHEMES[:8]
        ],
        "vulnerability_map": [
            {"district": d, "score": round(random.uniform(0.15, 0.85), 2), "families": random.randint(50000, 900000)}
            for d in GUJARAT_DISTRICTS
        ],
        "alerts": [
            {"type": "danger", "title": "Anomaly in PDS disbursal — Kutch", "time": "12 min ago"},
            {"type": "warning", "title": "42 duplicate citizens detected — Surat", "time": "38 min ago"},
            {"type": "info", "title": "Dataset PMAY-G v18 approved", "time": "1 hr ago"},
            {"type": "success", "title": "AI Copilot policy simulation completed", "time": "2 hr ago"},
        ],
    }


@api.get("/dashboards/district")
async def dashboard_district(user: TokenUser = Depends(get_current_user)):
    random.seed(2)
    return {
        "kpis": [
            {"key": "district", "label": "Selected District", "value": user.district or "Ahmedabad", "change": None, "icon": "MapPin", "color": "primary"},
            {"key": "pop", "label": "Population", "value": "76.5 Lakh", "change": 1.2, "icon": "Users", "color": "secondary"},
            {"key": "fam", "label": "Families", "value": "18.2 Lakh", "change": 2.1, "icon": "Home", "color": "accent"},
            {"key": "sat", "label": "Scheme Saturation", "value": "82.4%", "change": 3.8, "icon": "Target", "color": "success"},
        ],
        "talukas": [{"taluka": f"Taluka {i}", "families": random.randint(20_000, 240_000),
                     "coverage": round(random.uniform(55, 95), 1)} for i in range(1, 11)],
        "welfare_mix": [{"scheme": s["code"], "value": random.randint(20_000, 380_000)} for s in SCHEMES[:8]],
    }


@api.get("/dashboards/department")
async def dashboard_department(user: TokenUser = Depends(get_current_user)):
    random.seed(3)
    dept_list = await db.departments.find({}, {"_id": 0}).to_list(None)
    return {
        "kpis": [
            {"key": "records", "label": "Records Integrated", "value": "12.8 Cr", "change": 5.2, "icon": "Database", "color": "primary"},
            {"key": "quality", "label": "Avg Data Quality", "value": "91.8%", "change": 1.4, "icon": "ShieldCheck", "color": "success"},
            {"key": "sla", "label": "API SLA (30d)", "value": "99.72%", "change": 0.1, "icon": "Activity", "color": "accent"},
            {"key": "issues", "label": "Open Issues", "value": "24", "change": -18.0, "icon": "AlertTriangle", "color": "warning"},
        ],
        "departments": dept_list,
        "trends": [{"date": f"D-{i}", "throughput": random.randint(180_000, 620_000),
                    "errors": random.randint(200, 4200)} for i in range(14, 0, -1)],
    }


@api.get("/dashboards/data-lake")
async def dashboard_data_lake(user: TokenUser = Depends(get_current_user)):
    random.seed(4)
    return {
        "kpis": [
            {"key": "vol", "label": "Data Lake Volume", "value": "412 TB", "change": 8.2, "icon": "Database", "color": "primary"},
            {"key": "files", "label": "Files / Objects", "value": "38.4 M", "change": 4.3, "icon": "Files", "color": "secondary"},
            {"key": "jobs", "label": "Pipelines (24h)", "value": "1,842", "change": 2.1, "icon": "Workflow", "color": "accent"},
            {"key": "up", "label": "Cluster Uptime", "value": "99.98%", "change": 0.0, "icon": "Activity", "color": "success"},
        ],
        "zones": [
            {"zone": "Bronze (Raw)", "size_tb": 210, "files_m": 22.4, "growth": 8.9},
            {"zone": "Silver (Cleansed)", "size_tb": 142, "files_m": 11.8, "growth": 6.2},
            {"zone": "Gold (Curated)", "size_tb": 42, "files_m": 3.1, "growth": 4.1},
            {"zone": "Platinum (MDM)", "size_tb": 18, "files_m": 1.1, "growth": 2.4},
        ],
        "ingestion": [{"hour": f"{h}:00", "records": random.randint(2_000_000, 8_400_000)}
                      for h in range(0, 24, 2)],
    }


@api.get("/dashboards/data-quality")
async def dashboard_data_quality(user: TokenUser = Depends(get_current_user)):
    random.seed(5)
    dims = ["Completeness", "Uniqueness", "Validity", "Consistency", "Accuracy", "Timeliness"]
    return {
        "kpis": [
            {"key": "dqi", "label": "Overall DQ Index", "value": "94.2%", "change": 0.8, "icon": "ShieldCheck", "color": "success"},
            {"key": "dupes", "label": "Duplicate Citizens", "value": "142,308", "change": -12.4, "icon": "Copy", "color": "warning"},
            {"key": "invalid", "label": "Invalid Aadhaar", "value": "0.42%", "change": -0.08, "icon": "AlertCircle", "color": "danger"},
            {"key": "std", "label": "Address Standardized", "value": "96.8%", "change": 2.1, "icon": "MapPin", "color": "primary"},
        ],
        "radar": [{"dim": d, "score": round(random.uniform(80, 99), 1)} for d in dims],
        "dept_dq": [{"dept": d["name"], "score": round(random.uniform(75, 98), 1)} for d in DEPARTMENTS],
    }


@api.get("/dashboards/ai-governance")
async def dashboard_ai_governance(user: TokenUser = Depends(get_current_user)):
    random.seed(6)
    return {
        "kpis": [
            {"key": "models", "label": "Live Models", "value": "18", "change": 12.5, "icon": "Brain", "color": "primary"},
            {"key": "predictions", "label": "Predictions (24h)", "value": "3.42 M", "change": 8.4, "icon": "Zap", "color": "secondary"},
            {"key": "drift", "label": "Model Drift Alerts", "value": "3", "change": -25.0, "icon": "AlertTriangle", "color": "warning"},
            {"key": "fairness", "label": "Fairness Score", "value": "0.91", "change": 0.02, "icon": "Scale", "color": "success"},
        ],
        "models": [
            {"name": "Duplicate Detector v4.2", "type": "Similarity", "accuracy": 96.4, "status": "Production"},
            {"name": "Eligibility Predictor v3.1", "type": "Classification", "accuracy": 91.8, "status": "Production"},
            {"name": "Leakage Anomaly v2.0", "type": "Anomaly", "accuracy": 88.2, "status": "Staging"},
            {"name": "Vulnerability Index v1.4", "type": "Scoring", "accuracy": 89.7, "status": "Production"},
            {"name": "Address Standardizer v5.0", "type": "NER", "accuracy": 94.1, "status": "Production"},
            {"name": "Family Linker v3.3", "type": "Graph", "accuracy": 92.6, "status": "Production"},
        ],
    }


@api.get("/dashboards/citizen-kpis")
async def dashboard_citizen_kpis(user: TokenUser = Depends(get_current_user)):
    random.seed(7)
    return {
        "kpis": [
            {"key": "cit", "label": "Citizens Verified", "value": "5.98 Cr", "change": 2.1, "icon": "UserCheck", "color": "success"},
            {"key": "fam", "label": "Families Golden", "value": "1.38 Cr", "change": 3.4, "icon": "Home", "color": "primary"},
            {"key": "hoh", "label": "HoF Verified", "value": "1.34 Cr", "change": 2.8, "icon": "User", "color": "accent"},
            {"key": "avg", "label": "Avg Household Size", "value": "4.6", "change": -0.1, "icon": "Users", "color": "secondary"},
        ],
        "age_pyramid": [
            {"band": "0-5", "male": 320000, "female": 305000},
            {"band": "6-14", "male": 610000, "female": 594000},
            {"band": "15-24", "male": 892000, "female": 872000},
            {"band": "25-40", "male": 1240000, "female": 1210000},
            {"band": "41-60", "male": 950000, "female": 940000},
            {"band": "60+", "male": 480000, "female": 520000},
        ],
        "category_split": [
            {"name": "General", "value": 38}, {"name": "OBC", "value": 34},
            {"name": "SC", "value": 12}, {"name": "ST", "value": 11}, {"name": "EWS", "value": 5},
        ],
    }


# ================================================================
#                       ALERTS / NOTIFICATIONS
# ================================================================
@api.get("/notifications")
async def notifications(user: TokenUser = Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    return {
        "unread": 6,
        "items": [
            {"id": "n1", "type": "danger", "title": "Duplicate spike detected", "body": "72 potential duplicates in Kutch district PDS load.", "time": (now - timedelta(minutes=8)).isoformat(), "read": False},
            {"id": "n2", "type": "warning", "title": "Dataset approval pending", "body": "PMJAY-Gujarat v22 awaits your approval.", "time": (now - timedelta(minutes=32)).isoformat(), "read": False},
            {"id": "n3", "type": "info", "title": "New consent policy live", "body": "Aadhaar minimal disclosure v3.0 enforced across all APIs.", "time": (now - timedelta(hours=2)).isoformat(), "read": False},
            {"id": "n4", "type": "success", "title": "AI Copilot job complete", "body": "Scheme leakage simulation for Q4 finalized.", "time": (now - timedelta(hours=3)).isoformat(), "read": True},
            {"id": "n5", "type": "info", "title": "Family merge approved", "body": "Family F84210321 merged with F84210332.", "time": (now - timedelta(hours=5)).isoformat(), "read": True},
            {"id": "n6", "type": "warning", "title": "API rate limit warning", "body": "Health API usage at 82% of daily quota.", "time": (now - timedelta(hours=7)).isoformat(), "read": True},
        ],
    }


# ================================================================
#                       CITIZENS / MEMBERS
# ================================================================
@api.get("/citizens")
async def list_citizens(
    q: str = "", district: str = "", limit: int = 25, skip: int = 0,
    user: TokenUser = Depends(get_current_user),
):
    query = {}
    if q:
        query["$or"] = [{"name": {"$regex": q, "$options": "i"}},
                         {"member_id": {"$regex": q, "$options": "i"}},
                         {"mobile": {"$regex": q, "$options": "i"}}]
    if district:
        query["district"] = district
    total = await db.citizens.count_documents(query)
    items = await db.citizens.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    return {"total": total, "items": items}


@api.get("/citizens/{cid}")
async def get_citizen(cid: str, user: TokenUser = Depends(get_current_user)):
    doc = await db.citizens.find_one({"id": cid}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Citizen not found")
    family = await db.families.find_one({"family_id": doc["family_id"]}, {"_id": 0})
    members = await db.citizens.find({"family_id": doc["family_id"]}, {"_id": 0}).to_list(50)
    random.seed(hash(cid) % 10000)
    timeline = [
        {"date": "2024-06-12", "event": "Member ID generated", "source": "Aadhaar seeding", "icon": "IdCard"},
        {"date": "2024-08-04", "event": "Enrolled in PMJAY", "source": "Health Dept", "icon": "HeartPulse"},
        {"date": "2024-11-19", "event": "PM-KISAN installment received", "source": "Agriculture Dept", "icon": "Wheat"},
        {"date": "2025-02-08", "event": "Address updated", "source": "Revenue Dept", "icon": "MapPin"},
        {"date": "2025-09-01", "event": "Consent renewed", "source": "Citizen Portal", "icon": "ShieldCheck"},
    ]
    return {
        "citizen": doc,
        "family": family,
        "members": members,
        "timeline": timeline,
        "enrichments": {
            "health": {"jan_aushadhi_visits": random.randint(0, 12), "hospitalizations": random.randint(0, 3),
                       "insurance": "PMJAY + MA Yojana", "chronic": random.choice([[], ["Diabetes"], ["Hypertension"], ["Diabetes", "Hypertension"]])},
            "education": {"school": "Govt. Primary School" if doc["age"] < 15 else None,
                          "highest": doc.get("education"), "scholarships": random.choice([0, 1, 2])},
            "agriculture": {"land_ha": round(random.uniform(0, 4.5), 2), "crop": random.choice(["Cotton", "Groundnut", "Wheat", "Cumin", "N/A"])},
            "banking": {"accounts": random.randint(1, 3), "jan_dhan": random.choice([True, False]),
                        "dbt_last_credit": (datetime.now(timezone.utc) - timedelta(days=random.randint(1, 60))).isoformat()},
            "utility": {"electricity": random.choice(["UGVCL", "PGVCL", "MGVCL", "DGVCL"]), "lpg": "PMUY"},
            "property": {"pmay": random.choice([True, False]), "ration": doc.get("category")},
            "employment": {"mgnrega_days": random.randint(0, 90), "occupation": doc.get("occupation")},
        },
        "ai_summary": (
            f"{doc['name']} is a {doc['age']}-year-old {doc['gender']} resident of {doc['village']}, "
            f"{doc['district']}. Household appears eligible for {random.choice(['PMAY-G','MYSY','VVY'])}. "
            f"No welfare leakage flags in the last 12 months. Confidence {doc['confidence_score']:.2f}."
        ),
    }


@api.get("/members/matching")
async def member_matching(user: TokenUser = Depends(get_current_user)):
    random.seed(11)
    cits = await db.citizens.find({}, {"_id": 0}).limit(40).to_list(40)
    pairs = []
    for i in range(0, min(20, len(cits) - 1), 2):
        a, b = cits[i], cits[i + 1]
        pairs.append({
            "id": f"match-{i}",
            "a": {"id": a["id"], "name": a["name"], "district": a["district"], "aadhaar": a["aadhaar_masked"]},
            "b": {"id": b["id"], "name": b["name"], "district": b["district"], "aadhaar": b["aadhaar_masked"]},
            "score": round(random.uniform(0.62, 0.99), 3),
            "reason": random.choice(["Exact Aadhaar match", "Name + DOB + Village match", "Phonetic name + address"]),
            "status": random.choice(["Pending", "Auto-merged", "Reviewer needed"]),
        })
    return {"pairs": pairs}


# ================================================================
#                       FAMILIES
# ================================================================
@api.get("/families")
async def list_families(
    q: str = "", district: str = "", limit: int = 25, skip: int = 0,
    user: TokenUser = Depends(get_current_user),
):
    query = {}
    if q:
        query["$or"] = [{"family_id": {"$regex": q, "$options": "i"}},
                         {"hof_name": {"$regex": q, "$options": "i"}}]
    if district:
        query["district"] = district
    total = await db.families.count_documents(query)
    items = await db.families.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    return {"total": total, "items": items}


@api.get("/families/{fid}")
async def get_family(fid: str, user: TokenUser = Depends(get_current_user)):
    fam = await db.families.find_one({"family_id": fid}, {"_id": 0})
    if not fam:
        raise HTTPException(status_code=404, detail="Family not found")
    members = await db.citizens.find({"family_id": fid}, {"_id": 0}).to_list(50)
    random.seed(hash(fid) % 10000)
    timeline = [
        {"date": "2023-04-11", "event": "Family formed from Aadhaar cluster", "icon": "Users"},
        {"date": "2023-08-22", "event": "PDS ration card linked", "icon": "ShoppingBasket"},
        {"date": "2024-01-14", "event": "PMJAY enrolment completed", "icon": "HeartPulse"},
        {"date": "2024-09-30", "event": "HoF re-verified", "icon": "ShieldCheck"},
        {"date": "2025-06-04", "event": "Address standardized (v5.0)", "icon": "MapPin"},
    ]
    return {"family": fam, "members": members, "timeline": timeline}


# ================================================================
#                       DEPARTMENTS
# ================================================================
@api.get("/departments")
async def list_departments(user: TokenUser = Depends(get_current_user)):
    docs = await db.departments.find({}, {"_id": 0}).to_list(None)
    return {"items": docs}


# ================================================================
#                       SCHEMES / DBT
# ================================================================
@api.get("/schemes")
async def list_schemes(user: TokenUser = Depends(get_current_user)):
    docs = await db.schemes.find({}, {"_id": 0}).to_list(None)
    return {"items": docs}


@api.get("/dbt/dashboard")
async def dbt_dashboard(user: TokenUser = Depends(get_current_user)):
    random.seed(20)
    months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]
    return {
        "kpis": [
            {"key": "d", "label": "Total Disbursed (FY)", "value": "₹ 48,392 Cr", "change": 12.4, "icon": "Banknote", "color": "success"},
            {"key": "b", "label": "Beneficiaries", "value": "4.28 Cr", "change": 3.2, "icon": "Users", "color": "primary"},
            {"key": "f", "label": "Failed Payments", "value": "38,204", "change": -18.2, "icon": "XCircle", "color": "danger"},
            {"key": "l", "label": "Leakage Prevented", "value": "₹ 892 Cr", "change": 24.1, "icon": "Shield", "color": "accent"},
        ],
        "trend": [{"month": m, "amount": random.randint(4200, 6800)} for m in months],
        "by_scheme": [{"scheme": s["code"], "amount": random.randint(180, 2400)} for s in SCHEMES[:10]],
        "leakage_by_district": [{"district": d, "leakage_cr": round(random.uniform(0.5, 45), 1)}
                                for d in random.sample(GUJARAT_DISTRICTS, 15)],
    }


# ================================================================
#                       DATASETS
# ================================================================
@api.get("/datasets")
async def list_datasets(user: TokenUser = Depends(get_current_user)):
    random.seed(30)
    names = [
        ("PMJAY Gujarat Master", "HEALTH", "Parquet", "Silver"),
        ("PDS Ration Cards", "FOOD", "CSV", "Bronze"),
        ("PMAY-G Beneficiaries", "REV", "Parquet", "Gold"),
        ("Aadhaar Seeding Ledger", "GCSR", "Delta", "Platinum"),
        ("Anganwadi Registrations", "WCD", "CSV", "Silver"),
        ("Mid-Day Meal Attendance", "EDU", "Parquet", "Silver"),
        ("PM-KISAN Installments", "AGRI", "Parquet", "Gold"),
        ("MGNREGA Muster Rolls", "LABOR", "CSV", "Bronze"),
        ("MYSY Loan Ledger", "EDU", "Parquet", "Silver"),
        ("Land Records v4", "REV", "GeoJSON", "Gold"),
        ("UGVCL Consumer Master", "UTIL", "CSV", "Bronze"),
        ("Vahli Dikri Beneficiary", "WCD", "Parquet", "Silver"),
        ("Ayushman Card Registry", "HEALTH", "Delta", "Gold"),
        ("Jan Dhan Yojana Accounts", "FIN", "Parquet", "Silver"),
        ("MA Amrutum Yojana", "HEALTH", "Parquet", "Gold"),
        ("Digital Gujarat E-Nagar", "UTIL", "CSV", "Bronze"),
    ]
    items = []
    for n, d, f, z in names:
        items.append({
            "id": str(uuid.uuid4())[:8],
            "name": n,
            "department": d,
            "format": f,
            "zone": z,
            "size_gb": round(random.uniform(0.4, 84.5), 2),
            "rows_m": round(random.uniform(0.2, 320.0), 2),
            "version": f"v{random.randint(1, 22)}.{random.randint(0, 9)}",
            "quality": round(random.uniform(0.72, 0.99), 3),
            "status": random.choice(["Approved", "Approved", "Pending Review", "Draft"]),
            "owner": random.choice(["Data Team A", "Data Team B", "Health-Tech", "Rev-Tech"]),
            "updated": (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 60))).isoformat(),
        })
    return {"items": items}


# ================================================================
#                       AUDIT / CONSENT / SECURITY
# ================================================================
@api.get("/audit-logs")
async def audit_logs(user: TokenUser = Depends(get_current_user)):
    random.seed(40)
    now = datetime.now(timezone.utc)
    actions = ["LOGIN", "VIEW_CITIZEN", "MERGE_FAMILY", "APPROVE_DATASET", "EXPORT_REPORT",
                "UPDATE_CONSENT", "REVOKE_TOKEN", "SPLIT_FAMILY", "GENERATE_MEMBER_ID"]
    actors = ["state_admin", "dept_officer", "district_officer", "citizen", "system"]
    return {"items": [
        {"id": str(uuid.uuid4())[:8],
         "time": (now - timedelta(minutes=i * 7)).isoformat(),
         "actor": random.choice(actors),
         "action": random.choice(actions),
         "resource": random.choice(["citizen:C" + str(random.randint(10000000, 99999999)),
                                     "family:F" + str(random.randint(10000000, 99999999)),
                                     "dataset:PMJAY-v22", "scheme:PMKSN"]),
         "ip": f"10.0.{random.randint(1,254)}.{random.randint(1,254)}",
         "status": random.choice(["OK", "OK", "OK", "OK", "FAIL"])}
        for i in range(60)
    ]}


@api.get("/consents")
async def consents(user: TokenUser = Depends(get_current_user)):
    random.seed(41)
    now = datetime.now(timezone.utc)
    return {"items": [
        {"id": str(uuid.uuid4())[:8],
         "citizen_id": f"C{random.randint(10000000, 99999999)}",
         "purpose": random.choice(["Health Enrolment", "PDS Verification", "Scholarship Eligibility",
                                    "PMAY Verification", "MGNREGA Wage Credit"]),
         "scope": random.sample(["Name", "DOB", "Aadhaar-masked", "Address", "Bank", "Income", "Health"], k=random.randint(2, 5)),
         "granted": (now - timedelta(days=random.randint(1, 300))).isoformat(),
         "expires": (now + timedelta(days=random.randint(30, 365))).isoformat(),
         "status": random.choice(["Active", "Active", "Active", "Expired", "Revoked"])}
        for _ in range(40)
    ]}


# ================================================================
#                       AI COPILOT
# ================================================================
class ChatReq(BaseModel):
    prompt: str
    history: List[dict] = []


@api.post("/copilot/chat")
async def copilot_chat(req: ChatReq, user: TokenUser = Depends(get_current_user)):
    messages = req.history + [{"role": "user", "content": req.prompt}]
    answer = await chat_completion(messages)
    return {"answer": answer}


@api.get("/copilot/suggestions")
async def copilot_suggestions(user: TokenUser = Depends(get_current_user)):
    return {"suggestions": [
        "Which districts have the highest welfare leakage this quarter?",
        "Show me families in Kutch with 5+ members and low PDS coverage.",
        "Explain the risk score for citizen C48210394 and recommend actions.",
        "Simulate expanding VVY scheme income cap from ₹2L to ₹3L.",
        "List datasets with quality below 85% pending approval.",
        "Find potential Family ID duplicates in Surat district.",
    ]}


@api.get("/ai/risk-scores")
async def ai_risk_scores(user: TokenUser = Depends(get_current_user)):
    docs = await db.citizens.find({}, {"_id": 0, "id": 1, "name": 1, "district": 1,
                                        "risk_score": 1, "vulnerability_score": 1,
                                        "family_id": 1}).sort("risk_score", -1).limit(60).to_list(60)
    return {"items": docs}


@api.get("/ai/policy-simulator")
async def ai_policy_simulator(user: TokenUser = Depends(get_current_user)):
    random.seed(60)
    return {
        "scenarios": [
            {"name": "Baseline", "beneficiaries_cr": 1.28, "cost_cr": 4218, "leakage_pct": 1.82},
            {"name": "Raise income cap to ₹3L", "beneficiaries_cr": 1.62, "cost_cr": 5342, "leakage_pct": 1.65},
            {"name": "Add rural weightage", "beneficiaries_cr": 1.44, "cost_cr": 4712, "leakage_pct": 1.72},
            {"name": "Merge with DBT-Direct", "beneficiaries_cr": 1.51, "cost_cr": 4890, "leakage_pct": 1.42},
        ],
        "predictions": [{"district": d, "eligible": random.randint(20_000, 480_000)}
                         for d in random.sample(GUJARAT_DISTRICTS, 12)],
    }


# ================================================================
#                       GIS
# ================================================================
@api.get("/gis/state")
async def gis_state(user: TokenUser = Depends(get_current_user)):
    random.seed(70)
    return {"features": [
        {"district": d,
         "families": random.randint(120_000, 1_800_000),
         "coverage": round(random.uniform(58, 97), 1),
         "vulnerability": round(random.uniform(0.15, 0.85), 2),
         "lat": round(random.uniform(20.5, 24.5), 3),
         "lng": round(random.uniform(68.5, 74.5), 3)}
        for d in GUJARAT_DISTRICTS
    ]}


# ================================================================
#                       ADMIN / WORKFLOW
# ================================================================
@api.get("/admin/users")
async def admin_users(user: TokenUser = Depends(get_current_user)):
    docs = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(None)
    return {"items": docs}


@api.get("/admin/workflows")
async def admin_workflows(user: TokenUser = Depends(get_current_user)):
    random.seed(80)
    return {"items": [
        {"id": "wf-01", "name": "Dataset Onboarding", "steps": 6, "sla_hours": 48,
         "active_instances": 12, "success_rate": 94.2},
        {"id": "wf-02", "name": "Family Merge Approval", "steps": 4, "sla_hours": 12,
         "active_instances": 34, "success_rate": 97.8},
        {"id": "wf-03", "name": "Citizen Correction Request", "steps": 5, "sla_hours": 72,
         "active_instances": 89, "success_rate": 91.5},
        {"id": "wf-04", "name": "Scheme Eligibility Review", "steps": 7, "sla_hours": 24,
         "active_instances": 42, "success_rate": 88.9},
        {"id": "wf-05", "name": "Consent Renewal", "steps": 3, "sla_hours": 6,
         "active_instances": 178, "success_rate": 99.1},
    ]}


# ================================================================
#                       REPORTS
# ================================================================
@api.get("/reports/{kind}")
async def report(kind: str, user: TokenUser = Depends(get_current_user)):
    random.seed(hash(kind) % 10000)
    months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]
    return {
        "kind": kind,
        "series": [{"month": m, "value": random.randint(200, 4200)} for m in months],
        "table": [
            {"row": f"{kind.title()} Row {i}",
             "value_a": random.randint(1000, 90000),
             "value_b": round(random.uniform(30, 99), 1),
             "value_c": random.randint(10, 500)}
            for i in range(20)
        ],
    }


# ================================================================
#                       CITIZEN PORTAL (self-service)
# ================================================================
@api.get("/portal/family-lookup")
async def portal_family_lookup(aadhaar_last4: str = "", user: TokenUser = Depends(get_current_user)):
    docs = await db.citizens.find({}, {"_id": 0}).limit(5).to_list(5)
    return {"items": docs}


@api.get("/")
async def root():
    return {"service": "GCSR State Data Lakehouse", "status": "ok"}


app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
