import { useState } from "react";
import CustomBackdrop from "../../components/CustomBackdrop";
import GeneralModal from "../../components/GeneralModal";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import usePasses from "../../hooks/pass/usePasses";
import CustomLabelValue from "../../components/CustomLabelValue";
import useUser from "../../hooks/auth/useUser";
import CustomButton from "../../components/CustomButton";
import toast from "react-hot-toast";
import CustomTextarea from "../../components/CustomTextarea";
import { useForm } from "react-hook-form";

export default function Pass() {
	const [showPassDetails, setShowPassDetails] = useState(false);
	const [selectedPass, setSelectedPass] = useState(null);
	const [status, setStatus] = useState("");

	// const today = new Date().toISOString().split("T")[0];
	// const beginningOfYear = new Date(new Date().getFullYear(), 0, 1)
	// 	.toISOString()
	// 	.split("T")[0];

	const now = new Date();

	const isLate = (() => {
		if (!selectedPass?.end_date) return false;

		const endDate = new Date(selectedPass?.end_date);

		// Setting 6PM as the cutoff time
		const cutOff = new Date(endDate);
		cutOff.setHours(18, 0, 0, 0);

		const nowDateOnly = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		);
		const endDateOnly = new Date(
			endDate.getFullYear(),
			endDate.getMonth(),
			endDate.getDate()
		);

		// Case 1: It's the same day but current time is after 6 PM
		const isSameDayLate =
			nowDateOnly.getTime() === endDateOnly.getTime() && now > cutOff;

		// Case 2: It's after the return date regardless of time
		const isAfterReturnDate = nowDateOnly.getTime() > endDateOnly.getTime();

		return isSameDayLate || isAfterReturnDate;
	})();

	const { profile } = useUser();

	const { passes, isPending } = usePasses();

	const {
		handleSubmit,
		reset,
		register,
		formState: { errors },
	} = useForm({
		defaultValues: { late_checkin: "" },
	});

	const requestHeaders = [
		{ key: "username", value: "Matric No" },
		{ key: "fullname", value: "Full Name" },
		{ key: "destination", value: "Destination" },
		{ key: "type", value: "Type" },
		{ key: "purpose", value: "Purpose" },
		{ key: "start_date", value: "Start Date" },
		{ key: "end_date", value: "Return Date" },
		{ key: "num_days", value: "Duration" },
		{ key: "status", value: "Status" },
		{ key: "priority", value: "Priority" },
	];

	const exemptedKeys = [
		"id",
		"user_id",
		"created_at",
		"rejection_reason",
		"security_username",
		"security_name",
	];

	const labels = {
		department: "Department",
		destination: "Destination",
		email: "Email",
		end_date: "Return Date",
		guardian_name: "Guardian",
		guardian_phone: "Guardian contact",
		purpose: "Purpose",
		start_date: "Start Date",
		type: "Type",
		status: "Status",
		username: "Matric No",
		num_days: "Duration",
		admin_id: "Admin ID",
		phone: "Phone",
		room: "Room",
		fullname: "Full Name",
		priority: "Priority",
		admin_name: "Staff Name",
		admin_username: "Staff ID",
		updated_at: "Updated At",
		late_checkin: "Late Checkin",
	};

	const handleViewClick = (id) => {
		const result = passes.find((pass) => pass.id == id);
		setSelectedPass({ ...result });
	};

	const onSubmit = (data) => {
		console.log(data);
		if (!selectedPass?.id) {
			console.error("Error: No pass selected");
			toast.error("No pass selected");
			return;
		}
		if (selectedPass?.status !== "Checked out") {
			toast.error("Pass not approved yet");
			return;
		}
		if (isLate && !data.late_checkin) {
			toast.error("You're late. Please provide a reason.");
			return;
		}
	};

	return (
		<Layout title={"Pass"}>
			<div className="bg-white rounded-lg p-3 shadow-sm flex flex-col w-full">
				<div>
					<Table
						headers={requestHeaders}
						data={passes ?? []}
						isView
						onViewClick={(id) => {
							handleViewClick(id);
							setShowPassDetails(true);
						}}
					/>
				</div>
			</div>

			<GeneralModal
				isOpen={showPassDetails}
				onClose={() => setShowPassDetails(false)}
				showCloseButton
				widthClass="w-full">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid grid-cols-2 xs:flex xs:flex-col w-full gap-2 items-center text-left p-1">
						{selectedPass &&
							Object.entries(selectedPass)
								.filter(([key]) => !exemptedKeys.includes(key))
								.map(([a, b]) => {
									return (
										<CustomLabelValue key={a} label={labels[a]} value={b} />
									);
								})}
					</div>
					{isLate && (
						<div className="p-4">
							<CustomTextarea
								register={register("late_checkin", {
									validate: (value) =>
										isLate && !value
											? "Reason is required for late checkin"
											: false,
								})}
								error={errors?.late_checkin?.message}
								placeholder={"Write your reason for being late here."}
							/>
						</div>
					)}
					{profile?.role === "user" &&
						selectedPass?.status === "Checked out" && (
							<div className="ml-auto mt-2 w-[20%] lg:pr-1 xs:w-full xs:px-1">
								<CustomButton
									label={"Check in"}
									bgColor="#f2c008"
									bordered
									borderSize="lg"
									type="submit"
									onClick={() => setStatus("Checked in")}
								/>
							</div>
						)}
				</form>
			</GeneralModal>

			{isPending && <CustomBackdrop open={true} text={"Fetching data..."} />}
		</Layout>
	);
}
