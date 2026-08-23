from fastapi import APIRouter
from .health import router as health_router
from .profiles import router as profiles_router
from .genres import router as genres_router
from .friends import router as friends_router
from .movies import router as movies_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router, tags=["health"])
api_router.include_router(profiles_router)
api_router.include_router(genres_router)
api_router.include_router(friends_router)
api_router.include_router(movies_router)
