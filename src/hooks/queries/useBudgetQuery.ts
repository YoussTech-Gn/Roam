import { getBudget } from "@/src/utils/services/budgets";
import { useUser } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../utils/query/keys";
import { useSupabase } from "../useSupabase";

export const useBudgetQuery = () => {
  const { user } = useUser();
  const supabase = useSupabase();
  return useQuery({
    queryKey: queryKeys.budget(user?.id),
    queryFn: () => getBudget(supabase, user?.id!),
    enabled: !!user,
  });
};
