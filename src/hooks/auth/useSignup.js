import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { delayAction } from "../../helpers/custom";

export default function useSignup() {
	const navigate = useNavigate();
	const { mutate: signup, isPending: isSigningUp } = useMutation({
		mutationFn: signupApi,
		onSuccess: () => {
			toast.success("Account successfully created!");
			delayAction(() => {
				navigate("/login");
			}, 2000);
		},
	});
	return { signup, isSigningUp };
}
