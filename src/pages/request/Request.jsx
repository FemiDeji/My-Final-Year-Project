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

export default function Request() {
	const { requests, isPending } = useRequests();
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
	const [showRejection, setShowRejection] = useState(false);
	const { profile } = useUser();
	const [status, setStatus] = useState("");
	const { reviewRequest, isPending: isReviewing } = useReviewRequest();

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
	];

	const exemptedKeys = [
		"id",
		"user_id",
		"created_at",
		"rejection_reason",
		"admin_name",
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
		phone: "Phone",
		room: "Room",
		fullname: "Full Name",
	};

	console.log(requests);

	const {
		handleSubmit,
		register,
		formState: { errors },
		reset,
	} = useForm({ defaultValues: { rejection_reason: "" } });

	const handleViewRequestClick = (id) => {
		const result = requests.find((requestId) => requestId.id === id);
		result ? setSelectedRequest({ ...result }) : null;
	};

	const onSubmit = (data) => {
		if (!selectedRequest?.id) {
			console.error("Error: No request selected");
			toast.error("No request selected");
			return;
		}
		const requestData = {
			rejection_reason: data?.rejection_reason || "",
			admin_username: profile?.username,
			admin_name: profile?.fullname,
			status,
		};

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

	return (
		<Layout title={"Requests"}>
			<div></div>
			<div>
				<Table
					headers={requestHeaders}
					data={requests ?? []}
					isView
					onViewClick={(id) => {
						setShowRequestDetailsModal(true);
						handleViewRequestClick(id);
					}}
				/>
			</div>
			<GeneralModal
				classname={"xs:h-[90%]"}
				isOpen={showRequestDetailsModal}
				onClose={() => setShowRequestDetailsModal(false)}
				showCloseButton
				widthClass="w-full">
				<div className="xs:py-4 xs:px-0 p-4 flex flex-col justify-center items-center gap-3">
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
						{!showRejection && (
							<div className="flex flex-row gap-3 ml-auto w-[40%] xs:w-full">
								<CustomButton
									label={"Reject"}
									bgColor="#DFE6EC"
									bordered
									borderSize="lg"
									onClick={() => setShowRejection(true)}
								/>
								<CustomButton
									label={"Approve"}
									bgColor="#f2c008"
									bordered
									borderSize="lg"
									type="submit"
									onClick={() => setStatus("Approved")}
								/>
							</div>
						)}
						{showRejection && (
							<div className="flex flex-row gap-3 ml-auto w-[40%] xs:w-full">
								<CustomButton
									label={"Cancel"}
									bgColor="#DFE6EC"
									bordered
									borderSize="lg"
									onClick={() => setShowRejection(false)}
								/>
								<CustomButton
									label={"Reject"}
									bgColor="#f2c008"
									bordered
									borderSize="lg"
									type="submit"
									onClick={() => setStatus("Declined")}
								/>
							</div>
						)}
					</form>
				</div>
			</GeneralModal>
			{(isPending || isReviewing) && (
				<CustomBackdrop
					open={true}
					text={isReviewing ? "Please wait..." : "Fetching request..."}
				/>
			)}
		</Layout>
	);
}
