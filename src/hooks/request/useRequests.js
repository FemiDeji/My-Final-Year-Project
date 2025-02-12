import { useQuery } from "@tanstack/react-query";
import { getRequests } from "../../services/apiBookings";

export default function useRequests(data) {
	const {
		data: requests,
		isPending,
		error,
	} = useQuery({
		queryKey: ["requests", data],
		queryFn: () => getRequests(data),
	});
	return { requests, isPending, error };
}
