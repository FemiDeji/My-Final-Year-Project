import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export default function useReviewRequest() {
	const queryClient = useQueryClient();

	const {
		mutateAsync: reviewRequest,
		isPending,
		error,
	} = useMutation({
		mutationFn: ({ updateData, id }) => updateBooking(updateData, id),
		onSuccess: (data) => {
			toast.success("Request reviewed successdfully");
			queryClient.invalidateQueries(["bookings", data]);
		},
		onError: (err) => {
			console.log("Error", err.message);
			toast.error("Request could not be reviewed!");
		},
	});

	return { reviewRequest, isPending, error };
}
