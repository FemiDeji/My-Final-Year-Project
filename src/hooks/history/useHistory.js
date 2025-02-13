import { useQuery } from "@tanstack/react-query";
import { getHistory } from "../../services/apiHistory";
import useUser from "../auth/useUser";

export default function useHistory(data) {
	const { profile } = useUser();

	const role = profile?.role;
	const userId = profile?.id;

	const {
		data: history,
		isPending,
		error,
	} = useQuery({
		queryKey: ["history", role, userId, data],
		queryFn: () => getHistory(role, userId, data),
	});

	return { history, isPending, error };
}
