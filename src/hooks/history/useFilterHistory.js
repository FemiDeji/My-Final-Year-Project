import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getFilteredHistory } from "../../services/apiHistory";
import toast from "react-hot-toast";
import useUser from "../auth/useUser";

export default function useFilterHistory() {
	const queryClient = useQueryClient();
	const { profile } = useUser();

	const role = profile?.role;
	const userId = profile?.id;

	const {
		mutateAsync: filterHistory,
		isPending: isFiltering,
		error,
	} = useMutation({
		mutationFn: async ({ status, start_date, end_date }) =>
			getFilteredHistory({ role, userId, status, start_date, end_date }),
		onSuccess: (data) => {
			queryClient.invalidateQueries(["filtered-history", data]);
			toast.success("Filtered successfully");
		},
		onError: (err) => {
			console.error("Unable to filter data", err);
			toast.error("Failed to filter data");
		},
	});

	return { filterHistory, isFiltering, error };
}
