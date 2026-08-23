import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "./supabase";

/**
 * Configure Google Sign-In for native Android flow (Credential Manager).
 * Must be called before any sign-in attempt. Safe to call multiple times.
 *
 * Uses EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID (the *Web* client ID from
 * Google Cloud Console). The Android client ID is NOT needed for
 * Credential Manager - the Web client is used to mint the ID token
 * that Supabase validates.
 *
 * Supabase Dashboard: Authentication > Providers > Google > Skip Nonce Check
 * should be ENABLED when using this library, since it cannot generate a
 * hashed nonce for `signInWithIdToken`. Alternatively set
 * `auth.external.google.skip_nonce_check = true` in supabase config.toml for local dev.
 */
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID;

// Debug: log the configured webClientId (mask middle) so DEVELOPER_ERROR is diagnosable
if (__DEV__) {
  if (!WEB_CLIENT_ID) {
    console.warn(
      "[auth] EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID is not set. " +
        "Add it to .env (e.g. 167675865417-xxx.apps.googleusercontent.com)"
    );
  } else {
    console.log("[auth] Google webClientId configured:", WEB_CLIENT_ID.slice(0, 12) + "..." + WEB_CLIENT_ID.slice(-12));
  }
}

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  // offlineAccess false = only ID token, no server auth code needed for Supabase
  offlineAccess: false,
});

export type SignInResult =
  | { success: true }
  | { success: false; error: string; code?: string };

/**
 * Native Google Sign-In for Android (Expo + Supabase)
 * Follows: https://supabase.com/docs/guides/auth/social-login/auth-google?platform=android
 */
export async function signInWithGoogle(): Promise<SignInResult> {
  try {
    // Ensure device has Google Play Services (Android)
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();

    // With @react-native-google-signin >=13, response is { data: { idToken, ... } } | { type: "cancelled" }
    if (!isSuccessResponse(response)) {
      // User cancelled / dismissed
      return { success: false, error: "Sign-in cancelled", code: "CANCELLED" };
    }

    const idToken = response.data?.idToken;

    if (!idToken) {
      console.error("[auth] Google Sign-In succeeded but no idToken returned", response);
      return {
        success: false,
        error: "No ID token returned from Google. Check webClientId config.",
        code: "NO_ID_TOKEN",
      };
    }

    // Send ID token to Supabase Auth
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });

    if (error) {
      console.error("[auth] supabase signInWithIdToken error", error);
      // Common: nonce validation failed -> need to disable Skip Nonce Check in Supabase Dashboard
      if (error.message?.toLowerCase().includes("nonce")) {
        return {
          success: false,
          error:
            "Nonce validation failed. Enable 'Skip Nonce Check' in Supabase Dashboard > Authentication > Providers > Google.",
          code: "NONCE_ERROR",
        };
      }
      return { success: false, error: error.message, code: "SUPABASE_ERROR" };
    }

    if (!data.session) {
      return {
        success: false,
        error: "No session returned from Supabase. Check Supabase Google provider config.",
        code: "NO_SESSION",
      };
    }

    console.log("[auth] Signed in as", data.user?.email);
    return { success: true };
  } catch (error: any) {
    // Handle google-signin statusCodes
    if (error?.code === statusCodes.IN_PROGRESS) {
      return { success: false, error: "Sign-in already in progress", code: error.code };
    }
    if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        success: false,
        error: "Google Play Services not available or outdated. Please update.",
        code: error.code,
      };
    }
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
      return { success: false, error: "Sign-in cancelled", code: error.code };
    }

    // DEVELOPER_ERROR is the most common mis-configuration error on Android
    const msg: string = error?.message ?? "";
    const code: string = error?.code ?? "UNKNOWN";
    if (code === "DEVELOPER_ERROR" || msg.includes("DEVELOPER_ERROR")) {
      console.error("[auth] DEVELOPER_ERROR full error", JSON.stringify(error, null, 2));
      return {
        success: false,
        error:
          "DEVELOPER_ERROR: Google Sign-In misconfigured. Check:\n" +
          "1) EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID is a *Web* client (not Android) from Google Cloud Console\n" +
          "2) An Android OAuth client exists for package com.ayu.recsta with SHA-1 62:ED:12:1C:0F:50:22:90:3C:B5:E9:E6:B4:5F:94:3F:4C:50:59:4C (debug) and your release SHA-1\n" +
          "3) You're running a dev build (npx expo run:android), NOT Expo Go\n" +
          "4) Rebuild after env change: npx expo prebuild --clean && npx expo run:android\n" +
          "See https://react-native-google-signin.github.io/docs/troubleshooting",
        code: "DEVELOPER_ERROR",
      };
    }

    console.error("[auth] Unexpected signInWithGoogle error", error);
    return {
      success: false,
      error: msg || "Unknown error during Google sign-in",
      code,
    };
  }
}

/**
 * Sign out from both Google and Supabase
 */
export async function signOut(): Promise<void> {
  try {
    // Revoke Google session (ignore if not signed in)
    try {
      await GoogleSignin.signOut();
    } catch (e) {
      if (__DEV__) console.warn("[auth] Google signOut warning (ignored)", e);
    }
  } finally {
    const { error } = await supabase.auth.signOut();
    if (error && __DEV__) console.warn("[auth] supabase signOut error", error);
  }
}

/**
 * Get current Supabase session (convenience)
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}
