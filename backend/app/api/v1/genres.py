from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.db.supabase import get_supabase
from app.models.schemas import VALID_GENRES, SetGenresRequest

router = APIRouter(prefix="/genres", tags=["genres"])

@router.get("")
def list_all_genres():
    # mirrors constants/genres.ts
    return {
        "genres": [
            {"id": "action", "label": "Action"},
            {"id": "animation", "label": "Animation"},
            {"id": "comedy", "label": "Comedy"},
            {"id": "documentary", "label": "Documentary"},
            {"id": "drama", "label": "Drama"},
            {"id": "fantasy", "label": "Fantasy"},
            {"id": "horror", "label": "Horror"},
            {"id": "musical", "label": "Musical"},
            {"id": "romance", "label": "Romance"},
            {"id": "scifi", "label": "Sci-Fi"},
            {"id": "thriller", "label": "Thriller"},
            {"id": "western", "label": "Western"},
        ]
    }

@router.get("/me")
def get_my_genres(user=Depends(get_current_user)):
    sb = get_supabase()
    res = sb.table("user_genres").select("genre_id").eq("user_id", user["id"]).execute()
    return {"genre_ids": [r["genre_id"] for r in (res.data or [])]}

@router.put("/me")
def set_my_genres(payload: SetGenresRequest, user=Depends(get_current_user)):
    # validate
    invalid = [g for g in payload.genre_ids if g not in VALID_GENRES]
    if invalid:
        raise HTTPException(status_code=400, detail=f"Invalid genres: {invalid}")
    if len(payload.genre_ids) < 3:
        raise HTTPException(status_code=400, detail="Select at least 3 genres")
    
    sb = get_supabase()
    # delete existing
    sb.table("user_genres").delete().eq("user_id", user["id"]).execute()
    if payload.genre_ids:
        rows = [{"user_id": user["id"], "genre_id": g} for g in payload.genre_ids]
        res = sb.table("user_genres").insert(rows).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to save genres")
    return {"genre_ids": payload.genre_ids}

@router.get("/{user_id}")
def get_user_genres(user_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    res = sb.table("user_genres").select("genre_id").eq("user_id", user_id).execute()
    return {"genre_ids": [r["genre_id"] for r in (res.data or [])]}
