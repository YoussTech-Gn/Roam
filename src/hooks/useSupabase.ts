import { createClerkSupabaseClient } from "@/utils/supabase/supabase";
import { useAuth } from "@clerk/expo";
import { useMemo } from "react";

// /**
//  * Supabase client for public data
//  * Use this for data that is public and doesn't require authentication
//  */

/**
 * this function will create a supabase client with auth token for private data
 * frist we got getToken() from useAuth() hook
 * then we pass it to createClerkSupabaseClient() function
 * and it will return a supabase client with auth token
 * use this client to access private data
 * and user/client data
 * we used memo hook to prevent re-creating the client on every render
 */
export const useSupabase = () => {
  const { getToken } = useAuth();
  const client = useMemo(() => createClerkSupabaseClient(getToken), [getToken]);
  return client;
};
