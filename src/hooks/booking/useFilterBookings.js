import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "../auth/useUser";
import { getFilteredBookings } from "../../services/apiBookings";
import toast from "react-hot-toast";

export default function useFilterBookings() {
	const queryClient = useQueryClient();
	const { profile } = useUser();

	const role = profile?.role;
	const userId = profile?.id;

	const {
		mutateAsync: filterBookings,
		isPending,
		error,
	} = useMutation({
		mutationFn: async ({ start_date, end_date, priority }) =>
			getFilteredBookings({ role, userId, start_date, end_date, priority }),
		onSuccess: (data) => {
			queryClient.invalidateQueries(["filtered-bookings", data]);
			toast.success("Filtered successfully");
		},
		onError: (err) => {
			console.error("Unable to filter data", err);
			toast.error("Failed to filter data");
		},
	});

	return { filterBookings, isPending, error };
}
