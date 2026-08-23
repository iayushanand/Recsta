from fastapi import APIRouter
from app.db.supabase import get_supabase

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok", "service": "recsta-api"}

@router.get("/health/db")
def db_health():
    try:
        sb = get_supabase()
        # simple query to test connection - count profiles (may be 0)
        res = sb.table("profiles").select("id", count="exact").limit(1).execute()
        return {"status": "ok", "db": "connected", "profiles_count": res.count}
    except Exception as e:
        return {"status": "error", "db": str(e)}
