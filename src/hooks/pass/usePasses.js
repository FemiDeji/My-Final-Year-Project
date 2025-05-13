import { useQuery } from "@tanstack/react-query";
import { getPasses } from "../../services/apiBookings";

export default function usePasses(data) {
	const {
		data: passes,
		isPending,
		error,
	} = useQuery({
		queryKey: ["passes", data],
		queryFn: () => getPasses(data),
	});

	return { passes, isPending, error };
}
