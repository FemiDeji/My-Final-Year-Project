import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendPasswordResetEmail as sendPasswordResetEmailApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export default function useSendPasswordResetEmail() {
	const queryClient = useQueryClient();

	const {
		mutateAsync: sendPasswordResetEmail,
		isPending,
		error,
	} = useMutation({
		mutationFn: (email) => sendPasswordResetEmailApi(email),
		onSuccess: (data) => {
			queryClient.invalidateQueries(["reset-password", data]);
			toast.success("Email sent successfully!!");
		},
		onError: (error) => {
			console.error("error send reset email", error);
		},
	});
	return { sendPasswordResetEmail, isPending, error };
}
