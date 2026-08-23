from supabase import create_client, Client
from app.core.config import settings

# Service role client - bypasses RLS, use for trusted server operations
# Anon client would respect RLS but needs user JWT; service role is simpler for backend
_supabase: Client | None = None

def get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        # Prefer service_role if available, fallback to anon
        key = settings.supabase_service_role_key or settings.supabase_anon_key
        _supabase = create_client(settings.supabase_url, key)
    return _supabase

def get_supabase_for_user(access_token: str) -> Client:
    """Create a client that forwards the user's JWT so RLS applies correctly."""
    from supabase import create_client
    client = create_client(settings.supabase_url, settings.supabase_anon_key)
    client.postgrest.auth(access_token)
    # also set auth header for storage etc if needed
    return client
