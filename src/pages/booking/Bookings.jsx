import { FaPlus } from "react-icons/fa";
import CustomButton from "../../components/CustomButton";
import CustomSearchField from "../../components/CustomSearchField";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import useBookings from "../../hooks/booking/useBookings";
import CustomBackdrop from "../../components/CustomBackdrop";
import { useState } from "react";
import GeneralModal from "../../components/GeneralModal";
import CustomLabelValue from "../../components/CustomLabelValue";

export default function Bookings() {
	const navigate = useNavigate();
	const { bookings, isPending } = useBookings();
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);

	console.log("Bookings", bookings);

	const exemptedKeys = [
		"id",
		"user_id",
		"created_at",
		"fullname",
		"phone",
		"room",
		"email",
	];

	const labels = {
		department: "Department",
		destination: "Destination",
		email: "Email",
		end_date: "Return date",
		guardian_name: "Guardian",
		guardian_phone: "Guardian contact",
		purpose: "Purpose",
		start_date: "Start date",
		type: "Type",
		status: "Status",
		username: "Matric No",
		num_days: "Duration",
		admin_id: "Admin ID",
	};

	const handleViewClick = (id) => {
		const result = bookings.find((bookingId) => bookingId.id == id);
		result ? setSelectedBooking({ ...result }) : null;
	};
	console.log("selected booking", selectedBooking);

	const headers = [
		{ key: "destination", value: "Destination" },
		{ key: "type", value: "Type" },
		{ key: "purpose", value: "Purpose" },
		{ key: "start_date", value: "Start Date" },
		{ key: "end_date", value: "Return Date" },
		{ key: "num_days", value: "Duration" },
		{ key: "status", value: "Status" },
	];

	return (
		<Layout title={"Bookings"}>
			<div className="bg-white rounded-lg shadow-sm flex flex-col w-full p-3">
				<div className="flex gap-4 justify-end items-center">
					<div className="justify-end w-full lg:w-[40%] xs:hidden">
						<CustomSearchField placeholder={"Search"} borderRadius={"lg"} />
					</div>
					<div className="lg:w-[20%]">
						<CustomButton
							label={"Book Pass"}
							bgColor="#f2c008"
							textColor="#002855"
							bordered
							onClick={() => navigate("/new-booking")}>
							<FaPlus />
						</CustomButton>
					</div>
				</div>
				<div>
					<Table
						headers={headers}
						data={bookings ?? []}
						isView
						onViewClick={(id) => {
							setShowBookingDetailsModal(true);
							handleViewClick(id);
						}}
					/>
				</div>
			</div>
			<GeneralModal
				isOpen={showBookingDetailsModal}
				onClose={() => setShowBookingDetailsModal(false)}
				showCloseButton
				widthClass="w-full">
				<div className="grid grid-cols-2 xs:flex xs:flex-col w-full xs:px-0 xs:py-4 gap-2 items-center text-left p-4">
					{selectedBooking &&
						Object.entries(selectedBooking)
							.filter(([key]) => !exemptedKeys.includes(key))
							.map(([a, b]) => {
								return <CustomLabelValue value={b} label={labels[a]} key={a} />;
							})}
				</div>
			</GeneralModal>
			{isPending && (
				<CustomBackdrop open={true} text={"Fetching bookings..."} />
			)}
		</Layout>
	);
}
