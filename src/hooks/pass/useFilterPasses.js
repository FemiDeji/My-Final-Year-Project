import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getFilteredPasses } from "../../services/apiBookings";
import toast from "react-hot-toast";

export default function useFilterPasses() {
	const queryClient = useQueryClient();

	const {
		mutateAsync: filteredPasses,
		isPending,
		error,
	} = useMutation({
		mutationFn: async ({ start_date, end_date, priority }) =>
			getFilteredPasses({ start_date, end_date, priority }),
		onSuccess: (data) => {
			queryClient.invalidateQueries(["filtered-passes", data]);
			if (Array.isArray(data) && data.length === 0) {
				toast.success("No data found for the selected filters.");
			} else {
				toast.success("Filtered successfully.");
			}
		},
		onError: (err) => {
			console.error("Unable to filter data", err);
			toast.error("Failed to filter data");
		},
	});

	return { filteredPasses, isPending, error };
}
