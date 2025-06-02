import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkInUser } from "../../services/apiBookings";
import toast from "react-hot-toast";

export default function useCheckIn() {
	const queryClient = useQueryClient();

	const {
		mutateAsync: checkIn,
		isPending,
		error,
	} = useMutation({
		mutationFn: ({ updateData, id }) => checkInUser(updateData, id),
		onSuccess: (data) => {
			toast.success("Checked in sucessfully");
			queryClient.invalidateQueries(["passes", data]);
		},
		onError: (err) => {
			console.error("Error", err.message);
			toast.error("Check in unsuccessful!!");
		},
	});
	return { checkIn, isPending, error };
}
