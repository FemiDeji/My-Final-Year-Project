import { useQuery } from "@tanstack/react-query";
import { getPasses } from "../../services/apiBookings";
import useUser from "../auth/useUser";

export default function usePasses(data) {
	const { profile } = useUser();

	const role = profile?.role;
	const userId = profile?.id;

	const {
		data: passes,
		isPending,
		error,
	} = useQuery({
		queryKey: ["passes", role, userId, data],
		queryFn: () => getPasses(role, userId, data),
	});

	return { passes, isPending, error };
}
