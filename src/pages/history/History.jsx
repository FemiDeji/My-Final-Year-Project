import { FaFilter } from "react-icons/fa";
import CustomButton from "../../components/CustomButton";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import useHistory from "../../hooks/history/useHistory";
import GeneralModal from "../../components/GeneralModal";
import CustomInput from "../../components/CustomInput";
import { useForm } from "react-hook-form";
import CustomSelectField from "../../components/CustomSelectField";
import { useState } from "react";
import CustomBackdrop from "../../components/CustomBackdrop";
import useFilterHistory from "../../hooks/history/useFilterHistory";
import CustomLabelValue from "../../components/CustomLabelValue";

export default function History() {
	const today = new Date().toISOString().split("T")[0];
	const beginningOfYear = new Date(new Date().getFullYear(), 0, 1)
		.toISOString()
		.split("T")[0];

	const [showFilterModal, setShowFilterModal] = useState(false);
	const [filteredHistory, setFilteredHistory] = useState([]);
	const [selectedHistory, setSelectedHistory] = useState(null);
	const [showHistoryDetailsModal, setShowHistoryDetailsModal] = useState(false);

	const {
		handleSubmit,
		register,
		formState: { errors },
		getValues,
		setValue,
		reset,
	} = useForm({
		defaultValues: { start_date: beginningOfYear, end_date: today, status: "" },
	});
	const { history, isPending } = useHistory();
	const { filterHistory, isFiltering } = useFilterHistory();

	const statusOption = [
		{ key: "Approved", value: "Approved" },
		{ key: "Declined", value: "Declined" },
	];

	const headers = [
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

	const exemptedKeys = [
		"id",
		"user_id",
		"created_at",
		"fullname",
		"phone",
		"room",
		"email",
	];

	const handleReset = () => {
		setValue("status", "");

		reset();
	};

	const handleViewClick = (id) => {
		const result = history.find((historyId) => historyId.id == id);
		result ? setSelectedHistory({ ...result }) : null;
	};

	const onSubmit = async (data) => {
		try {
			const response = await filterHistory({
				status: data.status,
				start_date: data.start_date,
				end_date: data.end_date,
			});
			console.log("response", response);
			setShowFilterModal(false);
			handleReset();
			setFilteredHistory(response);
		} catch (err) {
			console.log("Error filtering history", err);
		}
	};

	const tableData = filteredHistory.length > 0 ? filteredHistory : history;

	return (
		<Layout title={"History"}>
			<div className="bg-white rounded-lg p-3 shadow-sm flex flex-col w-full">
				<div className="flex justify-end items-center gap-3 w-full">
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
				</div>
				<div className="mt-1">
					<Table
						headers={headers}
						data={tableData ?? []}
						isView
						onViewClick={(id) => {
							handleViewClick(id);
							setShowHistoryDetailsModal(true);
						}}
					/>
				</div>
			</div>
			{showHistoryDetailsModal && (
				<GeneralModal
					isOpen={showHistoryDetailsModal}
					onClose={() => setShowHistoryDetailsModal(false)}
					showCloseButton
					widthClass="w-full">
					<div className="grid grid-cols-2 xs:flex xs:flex-col w-full xs:px-0 xs:py-4 gap-2 items-center text-left p-4">
						{selectedHistory &&
							Object.entries(selectedHistory)
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
							label={"Status"}
							name={"status"}
							options={statusOption}
							optionKey="key"
							optionLabel="value"
							register={register("status")}
							error={errors?.status?.message}
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
				<CustomBackdrop open={true} text={"Please wait..."} />
			)}
		</Layout>
	);
}
