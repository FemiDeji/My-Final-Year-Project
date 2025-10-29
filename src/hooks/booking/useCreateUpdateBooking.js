import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUpdateBooking as createUpdateBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { delayAction } from "../../helpers/custom";
import { useNavigate } from "react-router-dom";
import useUser from "../auth/useUser";

export default function useCreateUpdateBooking() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { profile } = useUser();

	const {
		mutateAsync: createUpdateBooking,
		isPending: isBooking,
		error,
	} = useMutation({
		mutationFn: (newBooking) => createUpdateBookingApi(newBooking),
		onSuccess: (data) => {
			queryClient.invalidateQueries(["bookings", data]);
			toast.success(
				`${
					profile?.role === "super-admin" ? "Request" : "Booking"
				} successfully`
			);
			delayAction(() => {
				navigate(profile?.role === "super-admin" ? "/requests" : "/bookings");
			}, 2000);
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	return { createUpdateBooking, isBooking, error };
}
