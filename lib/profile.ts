import { supabase } from './supabase';
import type { Profile } from '../types/database';

// Ensure a profile exists for the current user (called on SIGNED_IN)
export async function ensureProfile(user: { id: string; email?: string | null; user_metadata?: any }) {
  const { data: existing } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (existing) return existing;

  const displayName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? (user.email ? user.email.split('@')[0] : null);
  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email ?? null,
    display_name: displayName,
    avatar_url: avatarUrl,
  }, { onConflict: 'id' });

  if (error) console.warn('[profile] ensureProfile upsert error', error.message);
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) {
    // table missing -> fallback null
    if (error.code === 'PGRST205' || error.message.includes('schema cache')) {
      console.warn('[profile] profiles table not created yet - run supabase/schema.sql');
      return null;
    }
    console.warn('[profile] getProfile error', error.message);
    return null;
  }
  return data as Profile;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', userId).select().single();
  if (error) throw error;
  return data as Profile;
}

// Genres
export async function getUserGenres(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from('user_genres').select('genre_id').eq('user_id', userId);
  if (error) {
    if (error.code === 'PGRST205') return [];
    throw error;
  }
  return (data ?? []).map((r: any) => r.genre_id);
}

export async function setUserGenres(userId: string, genreIds: string[]) {
  // delete existing then insert new (simple)
  const { error: delErr } = await supabase.from('user_genres').delete().eq('user_id', userId);
  if (delErr) throw delErr;
  if (genreIds.length === 0) return;
  const rows = genreIds.map(g => ({ user_id: userId, genre_id: g }));
  const { error } = await supabase.from('user_genres').insert(rows);
  if (error) throw error;
}

// Top movies helpers (optional)
export async function getTopMovies(userId: string) {
  const { data, error } = await supabase.from('user_top_movies').select('*').eq('user_id', userId).order('position');
  if (error) {
    if (error.code === 'PGRST205') return [];
    throw error;
  }
  return data;
}

// Friends
export async function getFriends(userId: string) {
  const { data, error } = await supabase.from('friendships').select('friend_id').eq('user_id', userId).eq('status', 'accepted');
  if (error) {
    if (error.code === 'PGRST205') return [];
    throw error;
  }
  const ids = (data ?? []).map((r: any) => r.friend_id);
  if (ids.length === 0) return [];
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, display_name, avatar_url, email, status_text').in('id', ids);
  if (pErr) throw pErr;
  return profiles ?? [];
}

export async function addFriendByEmail(currentUserId: string, friendEmail: string) {
  // find friend by email
  const { data: friend, error: findErr } = await supabase.from('profiles').select('id').eq('email', friendEmail).single();
  if (findErr || !friend) throw new Error('User not found by email: ' + friendEmail);
  if (friend.id === currentUserId) throw new Error("Can't add yourself");

  const { error } = await supabase.from('friendships').insert({ user_id: currentUserId, friend_id: friend.id, status: 'pending' });
  if (error) throw error;
}

// Stats helper - count friends etc
export async function getStats(userId: string) {
  try {
    const { count: friends } = await supabase.from('friendships').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'accepted');
    const { data: profile } = await supabase.from('profiles').select('saved_count, watched_count, friends_count').eq('id', userId).single();
    return {
      friends: friends ?? profile?.friends_count ?? 0,
      saved: profile?.saved_count ?? 164,
      watched: profile?.watched_count ?? 81,
    };
  } catch {
    return { friends: 0, saved: 164, watched: 81 };
  }
}
