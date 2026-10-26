import { useSupabase } from "@/hooks/useSupabase";
import { useUser } from "@clerk/expo";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";

export const useUserSync = () => {
  const { user } = useUser();
  const setCurrency = useUserStore((s) => s.setCurrency);
  const setNeedsOnboarding = useUserStore((s) => s.setNeedsOnboarding);
  const setSyncFailed = useUserStore((s) => s.setSyncFailed);
  const authSupabase = useSupabase();
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const syncUser = async () => {
      setSyncFailed(false);
      try {
        const { data: existing, error: fetchError } = await authSupabase
          .from("users")
          .select("clerk_id, currency")
          .eq("clerk_id", user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching user:", fetchError.message);
          if (!cancelled) setSyncFailed(true);
          return;
        }

        let currency = existing?.currency ?? null;

        if (!existing) {
          const { data: created, error: upsertError } = await authSupabase
            .from("users")
            .upsert(
              {
                clerk_id: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
                avatar: user.imageUrl,
              },
              { onConflict: "clerk_id" },
            )
            .select("currency")
            .single();

          if (upsertError) {
            console.error("Error upserting user:", upsertError.message);
            if (!cancelled) setSyncFailed(true);
            return;
          }
          currency = created?.currency ?? null;
        }

        // runs for new AND existing users, so a failed first attempt is repaired
        const { error: accountError } = await authSupabase
          .from("accounts")
          .insert({
            user_id: user.id,
            name: "Cash",
            type: "CASH",
            balance: 0,
            is_default: true,
          });
        if (accountError && accountError.code !== "23505") {
          console.error(
            "Error creating default account:",
            accountError.message,
          );
          if (!cancelled) setSyncFailed(true);
          return;
        }

        if (cancelled) return;
        setCurrency(currency ?? "XOF");
        setNeedsOnboarding(!currency);
      } catch {
        console.error("Unexpected sync error");
        if (!cancelled) setSyncFailed(true);
      }
    };

    syncUser();
    return () => {
      cancelled = true;
    };
  }, [user?.id, attempt]);

  return { retry };
};
