import { supabase } from "./supabase";

/**
 * Helper for calling the FastAPI backend.
 * Uses supabase session access_token for auth.
 * Set EXPO_PUBLIC_API_URL in .env (e.g. http://10.0.2.2:8000 for Android emulator, http://localhost:8000 for iOS/web)
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:8000";

async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("No session - please sign in first");
  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${body}`);
  }
  return res.json() as Promise<T>;
}

// --- Profiles ---
export async function fetchProfile() {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/api/v1/profile/me`, { headers });
  return handle(res);
}

export async function updateProfile(updates: Record<string, any>) {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/api/v1/profile/me`, {
    method: "PUT",
    headers,
    body: JSON.stringify(updates),
  });
  return handle(res);
}

// --- Genres ---
export async function fetchMyGenres(): Promise<{ genre_ids: string[] }> {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/api/v1/genres/me`, { headers });
  return handle(res);
}

export async function saveMyGenres(genre_ids: string[]) {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/api/v1/genres/me`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ genre_ids }),
  });
  return handle(res);
}

export async function fetchAllGenres() {
  const res = await fetch(`${API_URL}/api/v1/genres`);
  return handle<{ genres: { id: string; label: string }[] }>(res);
}

// --- Friends ---
export async function fetchFriends() {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/api/v1/friends`, { headers });
  return handle<{ friends: any[]; count: number }>(res);
}

export async function addFriend(email: string) {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/api/v1/friends`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email }),
  });
  return handle(res);
}

// --- Movies ---
export async function fetchRecommendations() {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/api/v1/movies/recommendations`, { headers });
  return handle<{ movies: any[]; based_on?: string[] }>(res);
}

export { API_URL };
