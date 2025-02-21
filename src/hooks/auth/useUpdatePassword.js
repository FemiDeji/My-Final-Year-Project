import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword as updatePasswordApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useUpdatePassword() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		mutateAsync: updatePassword,
		isPending: isUpdating,
		error,
	} = useMutation({
		mutationFn: (data) => updatePasswordApi(data),
		onSuccess: (data) => {
			queryClient.invalidateQueries(["password", data]);
			toast.success("Password reset successfully!!");
		},
		onError: (error) => {
			console.error("Error updating password", error);

			// check if token has expired
			if (error.message) {
				navigate("/reset-password-expired");
			}
		},
	});
	return { updatePassword, isUpdating, error };
}
