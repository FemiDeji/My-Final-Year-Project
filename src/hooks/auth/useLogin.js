import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export default function useLogin() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { mutate: login, isPending: isLogginIn } = useMutation({
		mutationFn: ({ identifier, password }) =>
			loginApi({ identifier, password }),
		onSuccess: (user) => {
			queryClient.setQueryData(["user"], user.user);
			navigate("/dashboard", { replace: true });
		},
		onError: (error) => {
			console.error("Error", error);
			toast.error("Provided email or password is incorrect");
		},
	});
	return { login, isLogginIn };
}
