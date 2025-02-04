import { useMutation } from "@tanstack/react-query";
import { getProfiles } from "../../services/apiProfiles";
import toast from "react-hot-toast";

export default function useGetProfile() {
	const {
		isPending,
		mutateAsync: profile,
		error,
	} = useMutation({
		mutationFn: (username) => getProfiles(username),
		onSuccess: () => {
			toast.success("Profile fetched successfully");
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	return { isPending, profile, error };
}
