import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getFilteredHistory } from "../../services/apiHistory";
import toast from "react-hot-toast";
import useUser from "../auth/useUser";

export default function useDownloadHistory() {
	const queryClient = useQueryClient();
	const { profile } = useUser();

	const role = profile?.role;
	const userId = profile?.id;

	const {
		mutateAsync: downloadHistory,
		isPending: isDownloading,
		error,
	} = useMutation({
		mutationFn: async ({ status, start_date, end_date }) =>
			getFilteredHistory({ role, userId, status, start_date, end_date }),
		onSuccess: (data) => {
			queryClient.invalidateQueries(["download-history", data]);
			toast.success("History downloaded successfully");
		},
		onError: (err) => {
			console.error("Unable to download history", err);
			toast.error("Failed to download history");
		},
	});

	return { downloadHistory, isDownloading, error };
}
