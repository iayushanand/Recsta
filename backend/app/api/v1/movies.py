from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.db.supabase import get_supabase
from app.models.schemas import TopMovie

router = APIRouter(prefix="/movies", tags=["movies"])

# Static catalog fallback - if you don't have a movies table yet
FALLBACK_CATALOG = [
    {"title": "Interstellar", "genre": "scifi", "year": 2014, "rating": 8.6},
    {"title": "La La Land", "genre": "musical", "year": 2016, "rating": 8.0},
    {"title": "Whiplash", "genre": "drama", "year": 2014, "rating": 8.5},
    {"title": "Prisoners", "genre": "thriller", "year": 2013, "rating": 8.1},
]

@router.get("/catalog")
def get_catalog(genre: str | None = None, q: str | None = None):
    data = FALLBACK_CATALOG
    if genre:
        data = [m for m in data if m["genre"] == genre]
    if q:
        data = [m for m in data if q.lower() in m["title"].lower()]
    return {"movies": data}

@router.get("/top")
def get_top_movies(user=Depends(get_current_user)):
    sb = get_supabase()
    res = sb.table("user_top_movies").select("*").eq("user_id", user["id"]).order("position").execute()
    return {"movies": res.data or []}

@router.put("/top")
def set_top_movies(movies: list[TopMovie], user=Depends(get_current_user)):
    sb = get_supabase()
    # clear existing
    sb.table("user_top_movies").delete().eq("user_id", user["id"]).execute()
    if movies:
        rows = [{"user_id": user["id"], "title": m.title, "genre_image_id": m.genre_image_id, "position": i} for i, m in enumerate(movies)]
        sb.table("user_top_movies").insert(rows).execute()
    return {"movies": movies}

@router.get("/recommendations")
def recommendations(user=Depends(get_current_user)):
    """Simple recommendation based on user's genres - demo logic"""
    sb = get_supabase()
    genres_res = sb.table("user_genres").select("genre_id").eq("user_id", user["id"]).execute()
    user_genres = [r["genre_id"] for r in (genres_res.data or [])]
    # naive: filter catalog by user's genres, else return all
    if not user_genres:
        return {"movies": FALLBACK_CATALOG, "reason": "no genres - showing popular"}
    filtered = [m for m in FALLBACK_CATALOG if m["genre"] in user_genres]
    return {"movies": filtered or FALLBACK_CATALOG, "based_on": user_genres}
