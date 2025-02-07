import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
			queryClient.removeQueries();
		},
	});

	useEffect(() => {
		if (isSuccess) {
			navigate("/login", { replace: true });
		}
	}, [isSuccess, navigate]);
	return { logout, isLoggingOut };
}
