import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUpdateBooking as createUpdateBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { delayAction } from "../../helpers/custom";
import { useNavigate } from "react-router-dom";

export default function useCreateUpdateBooking() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		mutateAsync: createUpdateBooking,
		isPending: isBooking,
		error,
	} = useMutation({
		mutationFn: (newBooking) => createUpdateBookingApi(newBooking),
		onSuccess: (data) => {
			console.log("Data", data);
			queryClient.invalidateQueries(["bookings", data]);
			toast.success("Booking successfully created");
			delayAction(() => {
				navigate("/bookings");
			}, 2000);
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	return { createUpdateBooking, isBooking, error };
}
