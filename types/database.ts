export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  status_text: string | null;
  favorite_decade: string | null;
  favorite_runtime: string | null;
  preferred_language: string | null;
  favorite_director: string | null;
  languages: string[] | null;
  horror_enabled: boolean;
  anime_enabled: boolean;
  musicals_enabled: boolean;
  friends_count: number;
  saved_count: number;
  watched_count: number;
  created_at: string;
  updated_at: string;
};

export type UserGenre = {
  user_id: string;
  genre_id: string;
  created_at: string;
};

export type UserTopMovie = {
  id: string;
  user_id: string;
  title: string;
  genre_image_id: string | null;
  position: number;
  created_at: string;
};

export type Friendship = {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
};

export type ProfileWithExtras = Profile & {
  genres?: string[];
  friends?: (Profile & { friendship_id: string })[];
  topMovies?: UserTopMovie[];
};
