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
		mutationFn: async ({ bookingId, updateData }) =>
			updateBooking(bookingId, updateData),
		onSuccess: () => {
			queryClient.invalidateQueries(["bookings"]);
			toast.success("Request updated successdfully");
		},
		onError: (err) => {
			console.log("Error", err.message);
			toast.error("Request could not be updated");
		},
	});

	return { reviewRequest, isPending, error };
}
