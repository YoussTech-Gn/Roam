import { TransactionFilters } from "@/src/types/transaction";
import { getTransactions } from "@/src/utils/services/transaction";
import { useUser } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../utils/query/keys";
import { useSupabase } from "../useSupabase";

export const useTransactionQuery = (filter: TransactionFilters = {}) => {
  const { user } = useUser();
  const supabase = useSupabase();
  return useQuery({
    queryKey: queryKeys.transactions(user?.id),
    queryFn: () => getTransactions(supabase, user?.id!, filter),
    enabled: !!user,
  });
};
