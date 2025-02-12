import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";

export default function useBookings(data) {
	const {
		data: bookings,
		isPending,
		error,
	} = useQuery({ queryKey: ["bookings", data], queryFn: () => getBookings() });

	return { bookings, isPending, error };
}
