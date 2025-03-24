import { useQuery } from "@tanstack/react-query";
import { getRecentBookings } from "../../services/apiBookings";

export default function useRecentBooking(data) {
	const {
		data: recentBookings,
		isPending,
		error,
	} = useQuery({
		queryKey: ["recent-bookings", data],
		queryFn: () => getRecentBookings(),
	});
	return { recentBookings, isPending, error };
}
