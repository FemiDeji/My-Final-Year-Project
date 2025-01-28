import Layout from "../../components/Layout";
import Stats from "../booking/Stats";
import ActivityChart from "./ActivityChart";
import BookingSummary from "./BookingSummary";

export default function Dashboard() {
	const data = [
		{ month: "Jan", bookings: 2, frequency: 1 },
		{ month: "Feb", bookings: 3, frequency: 2 },
		{ month: "Mar", bookings: 1, frequency: 0 },
		{ month: "Apr", bookings: 4, frequency: 0 },
		{ month: "May", bookings: 6, frequency: 2 },
		{ month: "Jun", bookings: 8, frequency: 2 },
		{ month: "Jul", bookings: 5, frequency: 3 },
	];

	const bookingData = [
		{ name: "Total Bookings", value: 120 },
		{ name: "Approved", value: 90 },
		{ name: "Rejected", value: 30 },
	];

	return (
		<Layout title={"Dashboard"}>
			<div className="w-full flex flex-col gap-3 xs:gap-6">
				<Stats />
				<div className="rounded-lg px-3 py-5 xs:px-1 flex flex-row gap-3 xs:flex-col xs:gap-7 bg-white shadow-md">
					<ActivityChart data={data} />
					<BookingSummary data={bookingData} />
				</div>
			</div>
		</Layout>
	);
}
