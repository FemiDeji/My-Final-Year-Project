import CustomBackdrop from "../../components/CustomBackdrop";
import Layout from "../../components/Layout";
import useUser from "../../hooks/auth/useUser";

import Stats from "../booking/Stats";
import useRecentBooking from "../booking/useRecentBooking";
import ActivityChart from "./ActivityChart";
import BookingSummary from "./BookingSummary";

export default function Dashboard() {
	// const thirtyDaysAgo = new Date();
	// thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const { profile } = useUser();

	const { recentBookings, isPending } = useRecentBooking();

	const numApproved = recentBookings?.filter(
		(booking) => booking.status === "Approved"
	).length;

	const numDeclined = recentBookings?.filter(
		(booking) => booking.status === "Declined"
	).length;

	const numCheckedOut = recentBookings?.filter(
		(booking) => booking.status === "Checked out"
	).length;

	const numCheckedIn = recentBookings?.filter(
		(booking) => booking.status === "Checked in"
	).length;

	const bookingData = [
		{ name: "Bookings", value: recentBookings?.length },
		{ name: "Approved", value: numApproved },
		{ name: "Rejected", value: numDeclined },
		...(profile?.role === "security"
			? [
					{ name: "Checked In", value: numCheckedIn },
					{ name: "Checked Out", value: numCheckedOut },
			  ]
			: []),
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

	return (
		<Layout title={"Dashboard"}>
			<div className="w-full flex flex-col gap-3 xs:gap-3">
				<Stats
					bookings={recentBookings}
					numApproved={numApproved}
					numDeclined={numDeclined}
					numCheckedIn={numCheckedIn}
					numCheckedOut={numCheckedOut}
				/>
				<div className="rounded-lg px-3 py-5 xs:px-1 flex flex-row gap-1 xs:flex-col xs:gap-7 bg-white shadow-md xs:overflow-y-auto xs:h-[50vh]">
					<ActivityChart data={data} />
					<BookingSummary data={bookingData} />
				</div>
			</div>

			{isPending && <CustomBackdrop open={true} text={"Please wait..."} />}
		</Layout>
	);
}
