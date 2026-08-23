from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

VALID_GENRES = ["action","animation","comedy","documentary","drama","fantasy","horror","musical","romance","scifi","thriller","western"]

class ProfileBase(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    status_text: Optional[str] = Field(default=None, examples=["Cinema is therapy."])
    favorite_decade: Optional[str] = None
    favorite_runtime: Optional[str] = None
    preferred_language: Optional[str] = None
    favorite_director: Optional[str] = None
    languages: Optional[List[str]] = None
    horror_enabled: Optional[bool] = None
    anime_enabled: Optional[bool] = None
    musicals_enabled: Optional[bool] = None

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: str
    email: Optional[str] = None
    friends_count: int = 0
    saved_count: int = 0
    watched_count: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class GenreList(BaseModel):
    genres: List[str] = Field(..., examples=[["action","scifi","thriller"]])

class SetGenresRequest(BaseModel):
    genre_ids: List[str] = Field(..., examples=[["action","animation","comedy"]])

class FriendRequest(BaseModel):
    email: str = Field(..., examples=["friend@example.com"])

class FriendResponse(BaseModel):
    id: str
    friend_id: str
    status: str
    created_at: Optional[datetime] = None
    friend_profile: Optional[ProfileResponse] = None

class TopMovie(BaseModel):
    title: str
    genre_image_id: Optional[str] = None
    position: int = 0

class TopMoviesResponse(BaseModel):
    movies: List[TopMovie]
