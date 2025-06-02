import { useQuery } from "@tanstack/react-query";
import { getHistory } from "../../services/apiHistory";

export default function useHistory(data) {
	const {
		data: history,
		isPending,
		error,
	} = useQuery({
		queryKey: ["history", data],
		queryFn: () => getHistory(data),
	});

	return { history, isPending, error };
}
