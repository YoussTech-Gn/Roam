import { createClient } from "@supabase/supabase-js";

const supabseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabseKey = process.env.EXPO_PUBLIC_SUPABASE_URL!;

if (!supabseUrl || !supabseKey) {
  throw new Error("Missing Supabase env ");
}
// export const supabase = createClient(supabseUrl, supabseKey, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

export const createClerkSupabaseClient = (
  getToken: () => Promise<string | null>,
) => {
  return createClient(supabseUrl, supabseKey, {
    async accessToken() {
      return getToken();
    },
  });
};
