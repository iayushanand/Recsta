import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
    const redirectTo = Linking.createURL("auth");
    console.log(redirectTo);
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo,
        },
    });

    if (error) throw error;

    await WebBrowser.openAuthSessionAsync(
        data.url!,
        redirectTo
    );
}