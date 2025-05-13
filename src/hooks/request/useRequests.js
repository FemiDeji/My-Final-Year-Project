import { useQuery } from "@tanstack/react-query";
import { getRequests } from "../../services/apiBookings";

export default function useRequests(data, role) {
	const {
		data: requests,
		isPending,
		error,
	} = useQuery({
		queryKey: ["requests", data, role],
		queryFn: () => getRequests(data, role),
	});
	return { requests, isPending, error };
}
