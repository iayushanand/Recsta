from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.db.supabase import get_supabase
from app.models.schemas import FriendRequest

router = APIRouter(prefix="/friends", tags=["friends"])

@router.get("")
def list_friends(user=Depends(get_current_user)):
    sb = get_supabase()
    res = sb.table("friendships").select("friend_id").eq("user_id", user["id"]).eq("status", "accepted").execute()
    ids = [r["friend_id"] for r in (res.data or [])]
    if not ids:
        return {"friends": []}
    profs = sb.table("profiles").select("id, display_name, avatar_url, email, status_text").in_("id", ids).execute()
    return {"friends": profs.data or [], "count": len(profs.data or [])}

@router.post("")
def add_friend(payload: FriendRequest, user=Depends(get_current_user)):
    sb = get_supabase()
    # find friend by email
    f = sb.table("profiles").select("id").eq("email", payload.email).single().execute()
    if not f.data:
        raise HTTPException(status_code=404, detail=f"User with email {payload.email} not found")
    friend_id = f.data["id"]
    if friend_id == user["id"]:
        raise HTTPException(status_code=400, detail="Can't add yourself")
    # check existing
    existing = sb.table("friendships").select("id").eq("user_id", user["id"]).eq("friend_id", friend_id).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Already friends or pending")
    res = sb.table("friendships").insert({"user_id": user["id"], "friend_id": friend_id, "status": "accepted"}).select().single().execute()
    # also optionally increment friends_count? could be via trigger, but do manual
    return {"friendship": res.data, "message": "Friend added"}

@router.delete("/{friend_id}")
def remove_friend(friend_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    res = sb.table("friendships").delete().eq("user_id", user["id"]).eq("friend_id", friend_id).execute()
    return {"deleted": True}

@router.get("/pending")
def list_pending(user=Depends(get_current_user)):
    sb = get_supabase()
    res = sb.table("friendships").select("*").eq("friend_id", user["id"]).eq("status", "pending").execute()
    return {"pending": res.data or []}
