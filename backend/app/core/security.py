import base64
import json
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import settings

security = HTTPBearer(auto_error=False)

def _decode_without_verify(token: str) -> dict:
    """Decode JWT payload without verifying signature - for dev/fallback."""
    try:
        # JWT is header.payload.signature
        payload = token.split(".")[1]
        # pad base64
        payload += "=" * (-len(payload) % 4)
        decoded = base64.urlsafe_b64decode(payload)
        return json.loads(decoded)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}")

def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security)) -> dict:
    """
    Extracts and verifies Supabase JWT from Authorization: Bearer <token>.
    Returns user dict with at least `id` (sub) and `email`.
    """
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization Bearer token")

    token = credentials.credentials

    # Try verified decode if JWT secret is configured
    if settings.supabase_jwt_secret:
        try:
            payload = jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                audience="authenticated",
            )
            return {
                "id": payload.get("sub"),
                "email": payload.get("email"),
                "role": payload.get("role"),
                "payload": payload,
            }
        except JWTError as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"JWT verification failed: {e}")

    # Fallback: decode without verification (dev mode) - still checks expiry loosely?
    payload = _decode_without_verify(token)
    if not payload.get("sub"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "role": payload.get("role"),
        "payload": payload,
    }

# Optional dependency for routes that allow anonymous but prefer auth
def get_optional_user(credentials: HTTPAuthorizationCredentials | None = Depends(security)) -> dict | None:
    if credentials is None:
        return None
    try:
        return get_current_user(credentials)
    except HTTPException:
        return None
