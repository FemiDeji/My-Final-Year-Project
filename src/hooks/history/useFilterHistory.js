import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getFilteredHistory } from "../../services/apiHistory";
import toast from "react-hot-toast";

export default function useFilterHistory() {
	const queryClient = useQueryClient();

	const {
		mutateAsync: filterHistory,
		isPending: isFiltering,
		error,
	} = useMutation({
		mutationFn: async ({ status, start_date, end_date }) =>
			getFilteredHistory({ status, start_date, end_date }),
		onSuccess: (data) => {
			queryClient.invalidateQueries(["filtered-history", data]);
			if (Array.isArray(data) && data.length === 0) {
				toast.success("No data found for selected filters.");
			} else {
				toast.success("Filtered successfully");
			}
		},
		onError: (err) => {
			console.error("Unable to filter data", err);
			toast.error("Failed to filter data");
		},
	});

	return { filterHistory, isFiltering, error };
}
