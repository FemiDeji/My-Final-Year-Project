import { useState } from "react";
import CustomBackdrop from "../../components/CustomBackdrop";
import GeneralModal from "../../components/GeneralModal";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import useRequests from "../../hooks/request/useRequests";
import CustomLabelValue from "../../components/CustomLabelValue";
import CustomButton from "../../components/CustomButton";
import CustomTextarea from "../../components/CustomTextarea";
import { useForm } from "react-hook-form";
import useUser from "../../hooks/auth/useUser";
import useReviewRequest from "../../hooks/request/useReviewRequest";
import toast from "react-hot-toast";
import { FaFilter, FaPlus } from "react-icons/fa";
import CustomInput from "../../components/CustomInput";
import CustomSelectField from "../../components/CustomSelectField";
import useFilterBookings from "../../hooks/booking/useFilterBookings";
import { useNavigate } from "react-router-dom";
import {
	General_Blue,
	General_Grey,
	General_Yellow,
} from "../../constants/colors";
import { ImageViewer } from "../../components/ImageViewer";

export default function Request() {
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
	const [showRejection, setShowRejection] = useState(false);
	const { profile } = useUser();
	const [status, setStatus] = useState("");
	const { reviewRequest, isPending: isReviewing } = useReviewRequest();
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [filteredRequests, setFilteredRequest] = useState([]);

	const { requests, isPending } = useRequests(profile?.role);
	const { filterBookings, isPending: isFiltering } = useFilterBookings();

	const navigate = useNavigate();

	const today = new Date().toISOString().split("T")[0];
	const beginningOfYear = new Date(new Date().getFullYear(), 0, 1)
		.toISOString()
		.split("T")[0];

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
		"admin_name",
		"admin_username",
		"security_username",
		"security_name",
		"image_evidence",
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
		updated_at: "Updated At",
		late_checkin: "Late Checkin",
	};

	// console.log(requests);

	const {
		handleSubmit,
		register,
		formState: { errors },
		reset,
		setValue,
		getValues,
	} = useForm({
		defaultValues: {
			rejection_reason: "",
			priority: "",
			start_date: beginningOfYear,
			end_date: today,
		},
	});

	const handleViewRequestClick = (id) => {
		const result = requests.find((requestId) => requestId.id === id);
		result ? setSelectedRequest({ ...result }) : null;
		console.log("selected request", selectedRequest);
	};

	const handleReset = () => {
		setValue("status", "");

		reset();
	};

	const priorityOptions = [
		{ key: "Normal", value: "Normal" },
		{ key: "Mid", value: "Mid" },
		{ key: "High", value: "High" },
	];

	const onSubmit = (data) => {
		if (!selectedRequest?.id) {
			console.error("Error: No request selected");
			toast.error("No request selected");
			return;
		}
		let requestData;

		if (profile?.role === "admin" || profile?.role === "super-admin") {
			requestData = {
				rejection_reason: data?.rejection_reason || "",
				admin_username: profile?.username,
				admin_name: profile?.fullname,
				status,
			};
		} else if (profile?.role === "security") {
			requestData = {
				security_username: profile?.username,
				security_name: profile?.fullname,
				status,
			};
		} else {
			toast.error("Unauthorized role");
			return;
		}

		reviewRequest(
			{
				updateData: { ...requestData },
				id: selectedRequest?.id,
			},
			{
				onSuccess: () => {
					reset();
					setShowRequestDetailsModal(false);
				},
			}
		);
	};

	const onFilter = async (data) => {
		try {
			const response = await filterBookings({
				priority: data.priority,
				start_date: data.start_date,
				end_date: data.end_date,
			});
			setFilteredRequest(response);
			handleReset();
			setShowFilterModal(false);
		} catch (err) {
			console.log("Error filtering requests", err);
		}
	};
	console.log("data", filteredRequests);

	const tableData = filteredRequests.length > 0 ? filteredRequests : requests;

	return (
		<Layout title={"Requests"}>
			<div className="bg-white rounded-lg p-3 shadow-sm flex flex-col w-full">
				<div className="flex lg:justify-end xs:justify-center items-center gap-3 w-full">
					{requests?.length > 0 && (
						<div className="lg:w-[20%] xs:w-full lg:ml-auto">
							<CustomButton
								label={"Filter Request"}
								bgColor={General_Yellow}
								textColor={General_Blue}
								bordered
								borderSize="lg"
								onClick={() => setShowFilterModal(true)}>
								<FaFilter />
							</CustomButton>
						</div>
					)}
					{profile?.role === "super-admin" && (
						<div className="lg:w-[20%] xs:w-full">
							<CustomButton
								label={"New Request"}
								bgColor={General_Yellow}
								textColor={General_Blue}
								bordered
								borderSize="lg"
								onClick={() => navigate("/requests/new")}>
								<FaPlus />
							</CustomButton>
						</div>
					)}
				</div>
				<div>
					<Table
						headers={requestHeaders}
						data={tableData ?? []}
						isView
						onViewClick={(id) => {
							setShowRequestDetailsModal(true);
							handleViewRequestClick(id);
						}}
					/>
				</div>
			</div>
			{showRequestDetailsModal && (
				<GeneralModal
					classname={"xs:h-[90%]"}
					isOpen={showRequestDetailsModal}
					onClose={() => setShowRequestDetailsModal(false)}
					showCloseButton
					widthClass="w-full">
					<div className="xs:py-4 xs:px-0 p-1 flex flex-col justify-center items-center gap-3">
						<div
							className="grid grid-cols-2 xs:flex xs:flex-col w-full 
						gap-2 items-center text-left">
							{selectedRequest &&
								Object.entries(selectedRequest)
									.filter(([key]) => !exemptedKeys.includes(key))
									.map(([a, b]) => {
										return (
											<CustomLabelValue value={b} label={labels[a]} key={a} />
										);
									})}
						</div>
						{selectedRequest?.image_evidence && (
							<div className="mb-3">
								<ImageViewer
									title={"Evidence"}
									src={selectedRequest?.image_evidence}
									alt={`image for ${selectedRequest?.fullname}`}
								/>
							</div>
						)}
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col gap-3 justify-center items-center w-full">
							{showRejection && (
								<div className="text-left w-full">
									<CustomTextarea
										label={"Reason"}
										name="rejection_reason"
										register={register("rejection_reason", {
											required: showRejection ? "Reason is required" : false,
										})}
										error={errors?.rejection_reason?.message}
										row={3}
										placeholder={"Write your reason for rejection here."}
									/>
								</div>
							)}
							{!showRejection &&
								(profile?.role === "admin" ||
									profile?.role === "super-admin") && (
									<div className="flex flex-row gap-3 ml-auto w-[40%] xs:w-full">
										<CustomButton
											label={"Reject"}
											bgColor={General_Grey}
											bordered
											borderSize="lg"
											onClick={() => setShowRejection(true)}
										/>
										<CustomButton
											label={"Approve"}
											bgColor={General_Yellow}
											bordered
											borderSize="lg"
											type="submit"
											onClick={() =>
												setStatus(
													selectedRequest?.status === "Late Checkin"
														? "Checked In"
														: "Approved"
												)
											}
										/>
									</div>
								)}
							{showRejection &&
								(profile?.role === "admin" ||
									profile?.role === "super-admin") && (
									<div className="flex flex-row gap-3 ml-auto w-[40%] xs:w-full">
										<CustomButton
											label={"Cancel"}
											bgColor={General_Grey}
											bordered
											borderSize="lg"
											onClick={() => setShowRejection(false)}
										/>
										<CustomButton
											label={"Reject"}
											bgColor={General_Yellow}
											bordered
											borderSize="lg"
											type="submit"
											onClick={() =>
												setStatus(
													selectedRequest?.status === "Late Checkin"
														? "Checked-in Late"
														: "Declined"
												)
											}
										/>
									</div>
								)}
							{profile?.role === "security" && (
								<div className="ml-auto mt-2 w-[20%] xs:w-full">
									<CustomButton
										label={"Check out"}
										bgColor={General_Yellow}
										bordered
										borderSize="lg"
										type="submit"
										onClick={() => setStatus("Checked out")}
									/>
								</div>
							)}
						</form>
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
					height="60vh"
					widthClass="xs:w-full w-[50%]">
					<form
						onSubmit={handleSubmit(onFilter)}
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
						{(profile?.role === "admin" || profile?.role === "super-admin") && (
							<CustomSelectField
								label={"Priority"}
								name={"priority"}
								options={priorityOptions}
								optionKey="key"
								optionLabel="value"
								register={register("priority")}
								error={errors?.priority?.message}
							/>
						)}
						<div className="flex flex-row gap-3 justify-center items-center ml-auto xs:mx-auto w-full">
							<CustomButton
								label={"Cancel"}
								bgColor={General_Grey}
								bordered
								borderSize="lg"
								onClick={() => {
									handleReset();
									setShowFilterModal(false);
								}}
							/>
							<CustomButton
								label={"Filter"}
								bgColor={General_Yellow}
								bordered
								textColor={General_Blue}
								borderSize="lg"
								type="submit"
							/>
						</div>
					</form>
				</GeneralModal>
			)}
			{(isPending || isReviewing || isFiltering) && (
				<CustomBackdrop
					open={true}
					text={!isPending ? "Please wait..." : "Fetching request..."}
				/>
			)}
		</Layout>
	);
}
