import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as userLocalStore from "./useLocalStore";

export default function useLogout() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		mutate: logout,
		isPending: isLoggingOut,
		isSuccess,
	} = useMutation({
		mutationFn: logoutApi,
		onSuccess: () => {
			userLocalStore.removeUser();
			queryClient.removeQueries();
		},
		onError: () => {
			userLocalStore.removeUser();
			queryClient.refetchQueries();
		},
	});

	useEffect(() => {
		if (isSuccess) {
			navigate("/login", { replace: true });
		}
	}, [isSuccess, navigate]);
	return { logout, isLoggingOut };
}
