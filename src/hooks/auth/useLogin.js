import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import * as userLocalStore from "../auth/useLocalStore";

export default function useLogin() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { mutate: login, isPending: isLogginIn } = useMutation({
		mutationFn: ({ identifier, password }) =>
			loginApi({ identifier, password }),
		onSuccess: ({ data: authData, profile }) => {
			console.log("User", authData);
			console.log("Profile", profile);
			queryClient.setQueryData(["user"], { authData, profile });

			if (authData?.user?.email) {
				userLocalStore.saveUser(authData.user, profile);

				navigate("/dashboard", { replace: true });
			} else {
				userLocalStore.removeUser();
			}
		},
		onError: (error) => {
			console.error("Error", error);
			toast.error("Provided email or password is incorrect");
			userLocalStore.removeUser();
		},
	});
	return { login, isLogginIn };
}
