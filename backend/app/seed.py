"""Rich Gujarat sample data seeded on startup. Idempotent."""
import random
import uuid
from datetime import datetime, timedelta, timezone
from .auth import hash_password


GUJARAT_DISTRICTS = [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar",
    "Junagadh", "Gandhinagar", "Anand", "Bharuch", "Mehsana", "Kheda",
    "Sabarkantha", "Banaskantha", "Kutch", "Panchmahal", "Dahod", "Valsad",
    "Navsari", "Amreli", "Porbandar", "Patan", "Surendranagar", "Tapi",
    "Aravalli", "Botad", "Chhota Udepur", "Devbhoomi Dwarka", "Gir Somnath",
    "Mahisagar", "Morbi", "Narmada", "Dang",
]

DEPARTMENTS = [
    {"code": "HEALTH", "name": "Health & Family Welfare", "icon": "HeartPulse", "color": "#DC2626"},
    {"code": "EDU", "name": "Education", "icon": "GraduationCap", "color": "#2563EB"},
    {"code": "REV", "name": "Revenue", "icon": "Landmark", "color": "#7C3AED"},
    {"code": "AGRI", "name": "Agriculture, Farmer Welfare & Co-operation", "icon": "Wheat", "color": "#059669"},
    {"code": "SW", "name": "Social Justice & Empowerment", "icon": "Users", "color": "#DB2777"},
    {"code": "FIN", "name": "Finance / DBT Mission", "icon": "Banknote", "color": "#0891B2"},
    {"code": "UTIL", "name": "Urban Development & Utilities", "icon": "Zap", "color": "#D97706"},
    {"code": "LABOR", "name": "Labour & Employment", "icon": "HardHat", "color": "#4F46E5"},
    {"code": "WCD", "name": "Women & Child Development", "icon": "Baby", "color": "#EC4899"},
    {"code": "FOOD", "name": "Food, Civil Supplies & Consumer Affairs", "icon": "ShoppingBasket", "color": "#65A30D"},
]

SCHEMES = [
    {"code": "PMAY-G", "name": "PM Awas Yojana (Gramin)", "dept": "REV", "beneficiaries": 342180},
    {"code": "PMJAY", "name": "Ayushman Bharat PM-JAY", "dept": "HEALTH", "beneficiaries": 1892340},
    {"code": "MDM", "name": "Mid-Day Meal Scheme", "dept": "EDU", "beneficiaries": 4210500},
    {"code": "PMKSN", "name": "PM Kisan Samman Nidhi", "dept": "AGRI", "beneficiaries": 5340120},
    {"code": "NSAP", "name": "National Social Assistance Programme", "dept": "SW", "beneficiaries": 892340},
    {"code": "PDS", "name": "Public Distribution System (NFSA)", "dept": "FOOD", "beneficiaries": 34210800},
    {"code": "ICDS", "name": "Integrated Child Development Services", "dept": "WCD", "beneficiaries": 3120450},
    {"code": "MGNREGA", "name": "Mahatma Gandhi NREGA", "dept": "LABOR", "beneficiaries": 2890340},
    {"code": "PMUY", "name": "PM Ujjwala Yojana", "dept": "UTIL", "beneficiaries": 1620980},
    {"code": "SBM", "name": "Swachh Bharat Mission", "dept": "UTIL", "beneficiaries": 892100},
    {"code": "MK-BIMA", "name": "Mukhyamantri Amrutum (MA) Yojana", "dept": "HEALTH", "beneficiaries": 1420800},
    {"code": "VVY", "name": "Vahli Dikri Yojana", "dept": "WCD", "beneficiaries": 342100},
    {"code": "MYSY", "name": "Mukhyamantri Yuva Swavlamban Yojana", "dept": "EDU", "beneficiaries": 128900},
    {"code": "GKY", "name": "Gujarat Krishi Kalyan Yojana", "dept": "AGRI", "beneficiaries": 890340},
]

FIRST_NAMES_M = ["Kiran", "Rajesh", "Mahesh", "Suresh", "Ramesh", "Bharat", "Nitin", "Vipul",
                  "Jignesh", "Hardik", "Yogesh", "Amit", "Rakesh", "Sunil", "Manoj", "Dipak",
                  "Ashok", "Kaushik", "Bhavesh", "Chirag", "Dhaval", "Hitesh", "Ketan", "Nilesh"]
FIRST_NAMES_F = ["Priya", "Nisha", "Anjali", "Rekha", "Kavita", "Sunita", "Meena", "Pooja",
                  "Neha", "Divya", "Krupa", "Bhavna", "Falguni", "Hetal", "Jyoti", "Manisha",
                  "Nayna", "Payal", "Rina", "Shweta", "Tejal", "Urmila", "Varsha", "Yasmin"]
SURNAMES = ["Patel", "Shah", "Modi", "Desai", "Mehta", "Parmar", "Solanki", "Rathod",
            "Chauhan", "Vaghela", "Thakor", "Gohil", "Jadeja", "Vora", "Trivedi", "Joshi",
            "Bhatt", "Pandya", "Rana", "Panchal", "Prajapati", "Suthar", "Barot", "Makwana"]

CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"]
RELIGIONS = ["Hindu", "Muslim", "Jain", "Sikh", "Christian", "Buddhist"]
OCCUPATIONS = ["Farmer", "Daily Wage", "Small Business", "Government Employee",
               "Private Employee", "Homemaker", "Student", "Retired", "Unemployed"]
INCOME_BANDS = ["<50k", "50k-1L", "1-2L", "2-5L", "5-10L", ">10L"]


def _make_id(prefix: str) -> str:
    n = random.randint(10_000_000, 99_999_999)
    return f"{prefix}{n}"


def _random_date(start_year=1940, end_year=2020) -> str:
    year = random.randint(start_year, end_year)
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    return f"{year:04d}-{month:02d}-{day:02d}"


def _mobile() -> str:
    return f"+91-{random.choice('6789')}{random.randint(100000000, 999999999)}"


def build_citizens(n: int = 400) -> tuple[list, list]:
    """Generate citizens and families with realistic relationships."""
    citizens = []
    families = []
    now = datetime.now(timezone.utc).isoformat()

    for f_idx in range(n // 4):  # ~4 members per family
        district = random.choice(GUJARAT_DISTRICTS)
        taluka = f"{district} Taluka {random.randint(1, 6)}"
        village = f"Village {random.choice(SURNAMES)}pura"
        surname = random.choice(SURNAMES)
        family_id = _make_id("F")

        household_size = random.choices([2, 3, 4, 5, 6, 7], weights=[5, 15, 30, 25, 15, 10])[0]
        income = random.choice(INCOME_BANDS)
        category = random.choice(CATEGORIES)
        religion = random.choice(RELIGIONS)
        rural = random.random() < 0.6

        hof = None
        member_ids = []
        for i in range(household_size):
            gender = "M" if (i == 0 or random.random() < 0.5) else "F"
            first = random.choice(FIRST_NAMES_M if gender == "M" else FIRST_NAMES_F)
            age = random.randint(1, 85)
            dob_year = 2026 - age
            relation = "Head" if i == 0 else random.choice(
                ["Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister"]
            )
            confidence = round(random.uniform(0.72, 0.99), 3)
            cid = _make_id("C")
            citizen = {
                "id": cid,
                "member_id": cid,
                "family_id": family_id,
                "name": f"{first} {surname}",
                "first_name": first,
                "surname": surname,
                "gender": gender,
                "age": age,
                "dob": f"{dob_year:04d}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
                "aadhaar_masked": f"XXXX-XXXX-{random.randint(1000, 9999)}",
                "mobile": _mobile() if age >= 18 else None,
                "email": (f"{first.lower()}.{surname.lower()}@example.in" if age >= 18 and random.random() < 0.4 else None),
                "category": category,
                "religion": religion,
                "occupation": random.choice(OCCUPATIONS) if age >= 15 else "Dependent",
                "education": random.choice(["None", "Primary", "Secondary", "Higher Secondary", "Graduate", "Post Graduate"]),
                "district": district,
                "taluka": taluka,
                "village": village,
                "address": f"{random.randint(1, 999)}, {random.choice(['Main Road', 'Bazaar Road', 'Station Road'])}, {village}",
                "pincode": f"{random.randint(360000, 396999)}",
                "relation_to_head": relation,
                "is_head_of_family": i == 0,
                "confidence_score": confidence,
                "sources": random.sample(["Aadhaar", "PDS", "PMAY", "PMJAY", "MGNREGA", "PM-KISAN", "Ration"], k=random.randint(2, 5)),
                "vulnerability_score": round(random.uniform(0.1, 0.95), 2),
                "risk_score": round(random.uniform(0.05, 0.85), 2),
                "created_at": now,
                "verified": random.random() < 0.85,
                "status": random.choice(["Active", "Active", "Active", "Active", "Under Review"]),
            }
            if i == 0:
                hof = f"{first} {surname}"
            member_ids.append(cid)
            citizens.append(citizen)

        families.append({
            "id": family_id,
            "family_id": family_id,
            "hof_name": hof,
            "hof_id": member_ids[0],
            "member_ids": member_ids,
            "household_size": household_size,
            "district": district,
            "taluka": taluka,
            "village": village,
            "rural_urban": "Rural" if rural else "Urban",
            "category": category,
            "religion": religion,
            "annual_income": income,
            "ration_card_type": random.choice(["APL", "BPL", "AAY", "PHH"]),
            "confidence_score": round(random.uniform(0.80, 0.99), 3),
            "welfare_saturation": round(random.uniform(0.20, 0.98), 2),
            "schemes_enrolled": random.sample([s["code"] for s in SCHEMES], k=random.randint(2, 7)),
            "verified": random.random() < 0.9,
            "created_at": now,
            "last_updated": now,
        })

    return citizens, families


def build_users() -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    return [
        {
            "id": str(uuid.uuid4()),
            "username": "state_admin",
            "email": "state.admin@gcsr.gujarat.gov.in",
            "full_name": "P. Bharathi, IAS",
            "password_hash": hash_password("Admin@123"),
            "role": "state_admin",
            "department": "GCSR / DST",
            "district": None,
            "designation": "Principal Secretary — Digital Gujarat",
            "created_at": now,
            "status": "active",
        },
        {
            "id": str(uuid.uuid4()),
            "username": "dept_officer",
            "email": "health.officer@gcsr.gujarat.gov.in",
            "full_name": "Dr. Anjali Desai",
            "password_hash": hash_password("Health@123"),
            "role": "department_officer",
            "department": "Health & Family Welfare",
            "district": None,
            "designation": "Joint Director",
            "created_at": now,
            "status": "active",
        },
        {
            "id": str(uuid.uuid4()),
            "username": "district_officer",
            "email": "collector.ahmedabad@gcsr.gujarat.gov.in",
            "full_name": "Rakesh Patel, IAS",
            "password_hash": hash_password("District@123"),
            "role": "district_officer",
            "department": "District Administration",
            "district": "Ahmedabad",
            "designation": "District Collector",
            "created_at": now,
            "status": "active",
        },
        {
            "id": str(uuid.uuid4()),
            "username": "citizen",
            "email": "priya.shah@example.in",
            "full_name": "Priya Shah",
            "password_hash": hash_password("Citizen@123"),
            "role": "citizen",
            "department": None,
            "district": "Vadodara",
            "designation": "Citizen",
            "created_at": now,
            "status": "active",
        },
    ]


async def seed_all(db):
    """Seed users, citizens, families if collections empty. Idempotent."""
    random.seed(42)  # deterministic

    if await db.users.count_documents({}) == 0:
        await db.users.insert_many(build_users())

    if await db.citizens.count_documents({}) == 0:
        citizens, families = build_citizens(n=480)
        await db.citizens.insert_many(citizens)
        await db.families.insert_many(families)

    if await db.departments.count_documents({}) == 0:
        docs = [{**d, "id": d["code"], "record_count": random.randint(80_000, 8_000_000),
                 "integration_status": random.choice(["Healthy", "Healthy", "Healthy", "Warning", "Degraded"]),
                 "last_sync": (datetime.now(timezone.utc) - timedelta(minutes=random.randint(1, 240))).isoformat(),
                 "quality_score": round(random.uniform(0.72, 0.98), 3)} for d in DEPARTMENTS]
        await db.departments.insert_many(docs)

    if await db.schemes.count_documents({}) == 0:
        docs = [{**s, "id": s["code"],
                 "coverage_pct": round(random.uniform(38, 96), 1),
                 "leakage_pct": round(random.uniform(0.5, 8.5), 2),
                 "duplicate_pct": round(random.uniform(0.1, 3.2), 2),
                 "monthly_disbursal_cr": round(random.uniform(12, 890), 2),
                 "status": "Active"} for s in SCHEMES]
        await db.schemes.insert_many(docs)

    if await db.districts.count_documents({}) == 0:
        docs = []
        for d in GUJARAT_DISTRICTS:
            docs.append({
                "id": d,
                "name": d,
                "population": random.randint(400_000, 7_800_000),
                "families": random.randint(120_000, 1_800_000),
                "coverage_pct": round(random.uniform(58, 97), 1),
                "dbt_disbursal_cr": round(random.uniform(80, 2400), 1),
                "data_quality": round(random.uniform(0.70, 0.98), 3),
                "duplicate_pct": round(random.uniform(0.4, 4.5), 2),
                "vulnerability_index": round(random.uniform(0.2, 0.8), 2),
            })
        await db.districts.insert_many(docs)
