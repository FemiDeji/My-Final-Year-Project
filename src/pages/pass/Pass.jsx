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
import useFilterPasses from "../../hooks/pass/useFilterPasses";
import { General_Blue, General_Yellow } from "../../constants/colors";
import {
	convertToDateTime,
	DATE_REQUEST_FORMAT,
} from "../../helpers/dateAndTime";
import { FaFilter } from "react-icons/fa";
import CustomInput from "../../components/CustomInput";
import CustomSelectField from "../../components/CustomSelectField";
import { PAGE_SIZE } from "../../constants/texts";
import useCheckIn from "../../hooks/pass/useCheckIn";
import FileInput from "../../components/FileInput";

export default function Pass() {
	const [showPassDetails, setShowPassDetails] = useState(false);
	const [selectedPass, setSelectedPass] = useState(null);
	const [status, setStatus] = useState("");
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [filterPass, setFilterPass] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize] = useState(PAGE_SIZE);

	const now = new Date();
	const today = new Date();
	const beginningOfYear = new Date(today.getFullYear(), 0, 1);

	const { profile } = useUser();
	const { passes, isPending } = usePasses();
	const { filteredPasses, isPending: isFiltering } = useFilterPasses();
	const { checkIn, isPending: isCheckingIn } = useCheckIn();

	const {
		handleSubmit,
		reset,
		getValues,
		register,
		formState: { errors },
	} = useForm({
		defaultValues: {
			late_checkin: "",
			start_date: convertToDateTime(beginningOfYear, DATE_REQUEST_FORMAT) || "",
			end_date: convertToDateTime(today, DATE_REQUEST_FORMAT) || "",
			priority: "Mid",
			image_evidence: null,
		},
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
		admin_name: "Staff Name",
		admin_username: "Staff ID",
		updated_at: "Updated At",
		late_checkin: "Late Checkin",
	};

	const priorityOptions = [
		{ key: "Normal", value: "Normal" },
		{ key: "Mid", value: "Mid" },
		{ key: "High", value: "High" },
	];

	const isLateCheckin = (() => {
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

	const handleViewClick = (id) => {
		const result = passes.find((pass) => pass.id == id);
		setSelectedPass({ ...result });
	};

	const onFilterPasses = async (data) => {
		try {
			const response = await filteredPasses({
				start_date: data.start_date,
				end_date: data.end_date,
				priority: data.priority,
			});
			console.log("res", response);
			setShowFilterModal(false);
			setFilterPass(response);
			reset();
		} catch (err) {
			console.log("err", err);
		}
		console.log({ ...data, status });
		reset();
	};

	const onSubmit = (data) => {
		console.log({ status, reason: data.late_checkin });
		if (!selectedPass?.id) {
			console.error("Error: No pass selected");
			toast.error("No pass selected");
			return;
		}
		if (selectedPass?.status !== "Checked out") {
			toast.error("Pass not approved yet");
			return;
		}
		if (isLateCheckin && !data.late_checkin) {
			toast.error("You're late. Please provide a reason.");
			return;
		}

		checkIn(
			{
				updateData: {
					status,
					late_checkin: data.late_checkin,
				},
				id: selectedPass?.id,
			},
			{
				onSuccess: () => {
					reset();
					setShowPassDetails(false);
				},
			}
		);

		console.log("data", {
			updateData: {
				status,
				late_checkin: data.late_checkin,
			},
			id: selectedPass?.id,
		});
	};

	const passData = filterPass?.length > 0 ? filterPass : passes;
	const startIndex = (pageNumber - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const paginatedData = passData?.slice(startIndex, endIndex);

	return (
		<Layout title={"Pass"}>
			<div className="bg-white rounded-lg p-3 shadow-sm flex flex-col w-full">
				{passes?.length > 0 && (
					<div className="lg:w-[20%] lg:ml-auto">
						<CustomButton
							label={"Filter Passes"}
							bgColor={General_Yellow}
							textColor={General_Blue}
							bordered
							onClick={() => setShowFilterModal(true)}
							borderSize="lg"
							type="button">
							<FaFilter />
						</CustomButton>
					</div>
				)}
				<div>
					<Table
						headers={requestHeaders}
						data={paginatedData ?? []}
						isView
						onViewClick={(id) => {
							handleViewClick(id);
							setShowPassDetails(true);
						}}
						totalCount={passData?.length ?? 0}
						currentPage={pageNumber}
						onPageChange={setPageNumber}
						pageSize={pageSize}
					/>
				</div>
			</div>

			{showPassDetails && (
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
						<div
							className={`p-1 text-left ${
								!isLateCheckin ? "hidden" : "block"
							}`}>
							<CustomTextarea
								register={register("late_checkin", {
									validate: (value) => {
										if (isLateCheckin && !value) {
											return "Reason is required for late checkin";
										}
										return true;
									},
								})}
								error={errors?.late_checkin?.message}
								placeholder={"Write your reason for being late here."}
							/>
						</div>
						<div
							className={`${
								!isLateCheckin ? "hidden" : "block"
							} p-1 text-left`}>
							<FileInput
								label={"Upload Image (optional)"}
								name="image_evidence"
								type="file"
								error={errors?.image_evidence?.message}
								register={register("image_evidence", {
									validate: {
										validType: (value) => {
											const file = value?.[0];
											if (!file) return true;
											return (
												["image/jpeg", "image.png"].includes(file.type) ||
												"Only JPEG or PNG images are allowed"
											);
										},
										validSize: (value) => {
											const file = value?.[0];
											if (!file) return true;
											return (
												file.size <= 2 * 1024 * 1024 ||
												"File must be less than 2 MB."
											);
										},
									},
								})}
							/>
						</div>
						{profile?.role === "user" &&
							selectedPass?.status === "Checked out" && (
								<div className="ml-auto mt-2 w-[20%] lg:pr-1 xs:w-full xs:px-1">
									<CustomButton
										label={"Check in"}
										bgColor={General_Yellow}
										bordered
										borderSize="lg"
										type="submit"
										onClick={() =>
											setStatus(isLateCheckin ? "Late Checkin" : "Checked in")
										}
									/>
								</div>
							)}
					</form>
				</GeneralModal>
			)}

			{showFilterModal && (
				<GeneralModal
					isOpen={showFilterModal}
					showCloseButton
					onClose={() => setShowFilterModal(false)}
					classname={"xs:w-full"}
					height="35vh">
					<form
						onSubmit={handleSubmit(onFilterPasses)}
						className="p-1 text-left flex flex-col gap-2 items-center justify-center">
						<CustomInput
							type="date"
							name="start_date"
							label={"Start date"}
							register={register("start_date", {
								validate: (value) =>
									value <= getValues().end_date ||
									"Start date cannot be after end date.",
							})}
							error={errors?.start_date?.message}
						/>
						<CustomInput
							label={"End date"}
							type="date"
							name="end_date"
							register={register("end_date", {
								validate: (value) =>
									value >= getValues().start_date ||
									"End date cannot be before start date.",
							})}
							error={errors?.end_date?.message}
						/>
						<CustomSelectField
							label={"Priority"}
							name={"priority"}
							options={priorityOptions}
							optionKey="key"
							optionLabel="value"
							register={register("priority")}
							error={errors?.priority?.message}
						/>
						<CustomButton
							label={"Filter"}
							bgColor={General_Yellow}
							bordered
							textColor={General_Blue}
							borderSize="lg"
							type="submit"
						/>
					</form>
				</GeneralModal>
			)}

			{(isPending || isFiltering || isCheckingIn) && (
				<CustomBackdrop
					open={true}
					text={isCheckingIn ? "Please wait..." : "Fetching data..."}
				/>
			)}
		</Layout>
	);
}
