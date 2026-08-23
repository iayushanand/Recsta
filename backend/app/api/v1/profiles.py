from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.db.supabase import get_supabase
from app.models.schemas import ProfileResponse, ProfileUpdate

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/me", response_model=ProfileResponse)
def get_me(user=Depends(get_current_user)):
    sb = get_supabase()
    res = sb.table("profiles").select("*").eq("id", user["id"]).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Profile not found - run supabase/schema.sql and ensure trigger")
    return res.data

@router.put("/me", response_model=ProfileResponse)
def update_me(payload: ProfileUpdate, user=Depends(get_current_user)):
    sb = get_supabase()
    # build update dict dropping Nones
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    res = sb.table("profiles").update(updates).eq("id", user["id"]).select().single().execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Update failed")
    return res.data

@router.get("/{user_id}", response_model=ProfileResponse)
def get_profile(user_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    res = sb.table("profiles").select("*").eq("id", user_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return res.data

@router.get("", response_model=list[ProfileResponse])
def list_profiles(q: str | None = None, limit: int = 20, user=Depends(get_current_user)):
    sb = get_supabase()
    query = sb.table("profiles").select("*").limit(limit)
    if q:
        query = query.ilike("display_name", f"%{q}%")
    res = query.execute()
    return res.data or []
