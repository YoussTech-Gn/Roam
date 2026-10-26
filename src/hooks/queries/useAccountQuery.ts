import { useUser } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../utils/query/keys";
import { getAccounts } from "../../utils/services/accounts";
import { useSupabase } from "../useSupabase";

export const useAccountQuery = () => {
  const { user } = useUser();
  const supabase = useSupabase();
  return useQuery({
    queryKey: queryKeys.accounts(user?.id),
    queryFn: () => getAccounts(supabase, user?.id!),
    enabled: !!user,
  });
};
