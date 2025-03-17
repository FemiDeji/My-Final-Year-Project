import { FaFilter, FaPlus } from "react-icons/fa";
import CustomButton from "../../components/CustomButton";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import useBookings from "../../hooks/booking/useBookings";
import CustomBackdrop from "../../components/CustomBackdrop";
import { useState } from "react";
import GeneralModal from "../../components/GeneralModal";
import CustomLabelValue from "../../components/CustomLabelValue";
import { useForm } from "react-hook-form";
import CustomSelectField from "../../components/CustomSelectField";
import CustomInput from "../../components/CustomInput";
import useFilterBookings from "../../hooks/booking/useFilterBookings";

export default function Bookings() {
	const navigate = useNavigate();
	const [filteredBookings, setFilteredBookings] = useState([]);
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [selectedPriority, setSelectedPriority] = useState("");
	const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);

	const { bookings, isPending } = useBookings();
	const { filterBookings, isPending: isFiltering } = useFilterBookings();

	const today = new Date().toISOString().split("T")[0];
	const beginningOfYear = new Date(new Date().getFullYear(), 0, 1)
		.toISOString()
		.split("T")[0];

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
		getValues,
	} = useForm({
		defaultValues: {
			priority: "",
			start_date: beginningOfYear,
			end_date: today,
		},
	});

	const exemptedKeys = [
		"id",
		"user_id",
		"created_at",
		"fullname",
		"phone",
		"room",
		"email",
	];

	const priorityOptions = [
		{ key: "Low", value: "Low" },
		{ key: "Mid", value: "Mid" },
		{ key: "High", value: "High" },
	];

	const handleReset = () => {
		setValue("priority", "");
		setSelectedPriority("");

		reset();
	};

	const labels = {
		department: "Department",
		destination: "Destination",
		email: "Email",
		end_date: "Return date",
		guardian_name: "Guardian",
		guardian_phone: "Guardian No",
		purpose: "Purpose",
		start_date: "Start date",
		type: "Type",
		status: "Status",
		username: "Matric No",
		num_days: "Duration",
		admin_username: "Admin Id",
		rejection_reason: "Reason",
		admin_name: "Admin Name",
		priority: "Priority",
	};

	const handleViewClick = (id) => {
		const result = bookings.find((bookingId) => bookingId.id == id);
		result ? setSelectedBooking({ ...result }) : null;
	};

	const headers = [
		{ key: "destination", value: "Destination" },
		{ key: "type", value: "Type" },
		{ key: "purpose", value: "Purpose" },
		{ key: "start_date", value: "Start Date" },
		{ key: "end_date", value: "Return Date" },
		{ key: "num_days", value: "Duration" },
		{ key: "status", value: "Status" },
		{ key: "priority", value: "Priority" },
	];

	const onSubmit = async (data) => {
		try {
			const response = await filterBookings({
				priority: data.priority,
				start_date: data.start_date,
				end_date: data.end_date,
			});
			console.log("res", response);
			setShowFilterModal(false);
			handleReset();
			setFilteredBookings(response);
		} catch (err) {
			console.log("Error filtering bookings", err);
		}
	};

	const tableData = filteredBookings.length > 0 ? filteredBookings : bookings;

	return (
		<Layout title={"Bookings"}>
			<div className="bg-white rounded-lg shadow-sm flex flex-col w-full p-3">
				<div className="flex gap-4 justify-end items-center">
					<div className="lg:w-[20%]">
						<CustomButton
							label={"Filter History"}
							bgColor="#f2c008"
							textColor="#002855"
							bordered
							borderSize="lg"
							onClick={() => setShowFilterModal(true)}>
							<FaFilter />
						</CustomButton>
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
						data={tableData ?? []}
						isView
						onViewClick={(id) => {
							setShowBookingDetailsModal(true);
							handleViewClick(id);
						}}
					/>
				</div>
			</div>
			{showBookingDetailsModal && (
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
									return (
										<CustomLabelValue value={b} label={labels[a]} key={a} />
									);
								})}
					</div>
				</GeneralModal>
			)}
			{showFilterModal && (
				<GeneralModal
					isOpen={showFilterModal}
					showCloseButton
					onClose={() => {
						setShowFilterModal(false);
						handleReset();
					}}
					widthClass="xs:w-full w-[50%]">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="text-left py-4 xs:py-3 flex flex-col gap-3">
						<div className="flex flex-col justify-center items-center gap-3">
							<CustomInput
								label={"Start date"}
								name="start_date"
								type="date"
								register={register("start_date", {
									validate: (value) =>
										value <= getValues().end_date ||
										"Start date cannot be after end date",
								})}
								error={errors?.start_date?.message}
							/>
							<CustomInput
								label={"End date"}
								name="end_date"
								type="date"
								register={register("end_date", {
									validate: (value) =>
										value >= getValues().start_date ||
										"End date cannot be before start date",
								})}
								error={errors?.end_date?.message}
							/>
						</div>
						<CustomSelectField
							label={"Priority"}
							name={"priority"}
							options={priorityOptions}
							optionKey="key"
							optionLabel="value"
							register={register("priority", {
								required: "Priority is required",
							})}
							error={errors?.priority?.message}
							onChange={setSelectedPriority}
							initialValue={selectedPriority}
						/>
						<div className="flex flex-row gap-3 justify-center items-center ml-auto xs:mx-auto w-full">
							<CustomButton
								label={"Cancel"}
								bgColor="#DFE6EC"
								bordered
								borderSize="lg"
								onClick={() => {
									handleReset();
									setShowFilterModal(false);
								}}
							/>
							<CustomButton
								label={"Filter"}
								bgColor="#f2c008"
								bordered
								borderSize="lg"
								type="submit"
							/>
						</div>
					</form>
				</GeneralModal>
			)}
			{(isPending || isFiltering) && (
				<CustomBackdrop open={true} text={"Fetching bookings..."} />
			)}
		</Layout>
	);
}
