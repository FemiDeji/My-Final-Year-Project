import CustomBackdrop from "../../components/CustomBackdrop";
import Layout from "../../components/Layout";

import Stats from "../booking/Stats";
import useRecentBooking from "../booking/useRecentBooking";
import ActivityChart from "./ActivityChart";
import BookingSummary from "./BookingSummary";

export default function Dashboard() {
	const { recentBookings, isPending } = useRecentBooking();

	const numApproved = recentBookings?.filter(
		(booking) => booking.status === "Approved"
	).length;

	const numDeclined = recentBookings?.filter(
		(booking) => booking.status === "Declined"
	).length;

	const bookingData = [
		{ name: "Total Bookings", value: recentBookings?.length },
		{ name: "Approved", value: numApproved },
		{ name: "Rejected", value: numDeclined },
	];

	const monthlyData = recentBookings?.reduce((acc, booking) => {
		const month = new Date(booking.created_at).toLocaleString("en-US", {
			month: "short",
		});

		if (!acc[month]) {
			acc[month] = { bookings: 0, totalDays: 0 };
		}

		acc[month].bookings += 1;
		acc[month].totalDays += booking.num_days || 0; // Count occurences of each month

		return acc;
	}, {});

	const data = Object.keys(monthlyData || {}).map((month) => ({
		month,
		bookings: monthlyData[month].bookings,
		frequency: monthlyData[month].totalDays / monthlyData[month].bookings || 0,
	}));

	console.log("data", data);

	return (
		<Layout title={"Dashboard"}>
			<div className="w-full flex flex-col gap-3 xs:gap-6">
				<Stats
					bookings={recentBookings}
					numApproved={numApproved}
					numDeclined={numDeclined}
				/>
				<div className="rounded-lg px-3 py-5 xs:px-1 flex flex-row gap-3 xs:flex-col xs:gap-7 bg-white shadow-md">
					<ActivityChart data={data} />
					<BookingSummary data={bookingData} />
				</div>
			</div>

			{isPending && <CustomBackdrop open={true} text={"Please wait..."} />}
		</Layout>
	);
}
