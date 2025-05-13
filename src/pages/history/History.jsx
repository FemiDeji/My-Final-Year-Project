import { FaCloudDownloadAlt, FaFilter } from "react-icons/fa";
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
import toast from "react-hot-toast";
// import { generateExcel, generatePDF } from "../../helpers/documentDownload";
import useUser from "../../hooks/auth/useUser";
import useCustomFileDownload from "../../helpers/useCustomFileDownload";
import { convertToDateTime } from "../../helpers/dateAndTime";
import useDownloadHistory from "../../hooks/history/useDownloadHistory";

export default function History() {
	const today = new Date().toISOString().split("T")[0];
	const beginningOfYear = new Date(new Date().getFullYear(), 0, 1)
		.toISOString()
		.split("T")[0];
	const { profile } = useUser();
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [filteredHistory, setFilteredHistory] = useState([]);
	const [selectedHistory, setSelectedHistory] = useState(null);
	const [showHistoryDetailsModal, setShowHistoryDetailsModal] = useState(false);
	const [showHistoryDownloadModal, setShowHistoryDownloadModal] =
		useState(false);
	const [fileFormat, setFileFormat] = useState("");
	const [downloadableData, setDownloadableData] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize] = useState(10);

	const {
		handleSubmit,
		register,
		formState: { errors },
		getValues,
		setValue,
		reset,
		watch,
	} = useForm({
		defaultValues: {
			start_date: beginningOfYear,
			end_date: today,
			status: "",
			docFormat: "PDF",
		},
	});
	const { history, isPending } = useHistory();
	const { filterHistory, isFiltering } = useFilterHistory();
	const { downloadHistory, isDownloading } = useDownloadHistory();

	const startDate = watch("start_date");
	const endDate = watch("end_date");

	const statusOption = [
		{ key: "Approved", value: "Approved" },
		{ key: "Declined", value: "Declined" },
	];

	const docFormatOptions = [
		{ key: "PDF", value: "PDF" },
		{ key: "EXCEL", value: "Excel" },
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

			if (response.length === 0) {
				toast.success("No history available for the selected date range");
				return;
			}

			setShowFilterModal(false);
			handleReset();
			setFilteredHistory(response);
		} catch (err) {
			console.log("Error filtering history", err);
		}
	};

	/* const downloadFile = (data, format) => {
		const fileName = `history_${new Date().toISOString()}.${format}`;
		const title =
			profile?.role === "user"
				? `History of ${profile?.username} from ${startDate} to ${endDate}`
				: `History from ${startDate} to ${endDate}`;

		if (fileFormat === "pdf") {
			generatePDF(data, fileName, title, headers);
		} else if (fileFormat === "excel") {
			generateExcel(data, fileName, headers, title);
		}
	}; */

	const { downloadAs } = useCustomFileDownload({
		actualData: downloadableData,
		reportTitle:
			profile?.role === "user"
				? `Report for ${profile?.username} from ${startDate} to ${endDate}`
				: `Report from ${convertToDateTime(
						startDate,
						"Do MMMM YYYY"
				  )} to ${convertToDateTime(endDate, "Do MMMM YYYY")}`,
		filename: `Report from ${startDate} to ${endDate}`,
		dataHeaders: headers,
		dataKey: "",
		preEvent: null,
		getData: () => {},
		// startDate: convertToDateTime(startDate, "Do MMMM YYYY"),
		// endDate: convertToDateTime(endDate, "Do MMMM YYYY"),
	});

	const handleDownload = async (data) => {
		try {
			const downloadedData = await downloadHistory({
				status: data.status,
				start_date: data.start_date,
				end_date: data.end_date,
			});

			if (downloadedData.length === 0) {
				toast.success("No history available for the selected date range");
				return;
			}
			setPageNumber(1);
			setShowHistoryDownloadModal(false);
			downloadAs(data.docFormat, downloadedData);
			setDownloadableData(downloadedData);
		} catch (err) {
			console.log("Error fetching history for download", err);
		}
	};

	const tableData = filteredHistory.length > 0 ? filteredHistory : history;

	const startIndex = (pageNumber - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const paginatedData = tableData?.slice(startIndex, endIndex);

	return (
		<Layout
			title={"History"}
			button={history?.length > 0}
			bgColor={"#f2c008"}
			textColor={"#002855"}
			borderSize={"lg"}
			btnChildren={<FaCloudDownloadAlt />}
			bordered
			btnOnClick={() => setShowHistoryDownloadModal(true)}
			label={"Download History"}>
			<div className="bg-white rounded-lg p-3 shadow-sm flex flex-col w-full">
				<div className="flex justify-end items-center gap-3 w-full">
					{history?.length > 0 && (
						<div className="lg:w-[22%] xs:w-[40%]">
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
					)}
					{filteredHistory.length > 0 && (
						<div className="lg:w-[22%] xs:w-[40%]">
							<CustomButton
								label={"Clear Filter"}
								bgColor="#f2c008"
								textColor="#002855"
								bordered
								borderSize="lg"
								onClick={() => setFilteredHistory([])}>
								<FaFilter />
							</CustomButton>
						</div>
					)}
				</div>
				<div className="mt-1">
					<Table
						headers={headers}
						data={paginatedData ?? []}
						isView
						onViewClick={(id) => {
							handleViewClick(id);
							setShowHistoryDetailsModal(true);
						}}
						totalCount={tableData?.length ?? 0}
						currentPage={pageNumber}
						onPageChange={setPageNumber}
						pageSize={pageSize}
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
					height="xs:60vh"
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
						{profile?.role === "admin" && (
							<CustomSelectField
								label={"Status"}
								name={"status"}
								options={statusOption}
								optionKey="key"
								optionLabel="value"
								register={register("status")}
								error={errors?.status?.message}
							/>
						)}
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
								bgColor="#f2C008"
								bordered
								borderSize="lg"
								type="submit"
							/>
						</div>
					</form>
				</GeneralModal>
			)}
			{showHistoryDownloadModal && (
				<GeneralModal
					isOpen={showHistoryDownloadModal}
					showCloseButton
					height="xs:80vh"
					widthClass="w-[50%] xs:w-full"
					onClose={() => {
						setShowHistoryDownloadModal(false);
						reset();
						setFileFormat("pdf");
					}}>
					<form
						onSubmit={handleSubmit(handleDownload)}
						className="flex flex-col justify-center items-center w-full my-3 text-left gap-3">
						<p className="text-center">
							Please select the format you would like to download
						</p>
						<CustomSelectField
							label={"File Format"}
							name={"docFormat"}
							register={register("docFormat", {
								required: "File format is required",
							})}
							error={errors?.docFormat?.message}
							onChange={setFileFormat}
							initialValue={fileFormat}
							options={docFormatOptions}
							optionKey="key"
							optionLabel="value"
						/>
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
						{profile?.role === "admin" && (
							<CustomSelectField
								label={"Status"}
								name={"status"}
								options={statusOption}
								optionKey="key"
								optionLabel="value"
								register={register("status")}
								error={errors?.status?.message}
							/>
						)}
						<div className="flex justify-center items-center lg:w-full lg:ml-auto gap-3 mt-3 xs:justify-between xs:w-full">
							<CustomButton
								label={"Cancel"}
								textColor="#002855"
								bgColor="#DFE6EC"
								bordered
								borderSize="lg"
							/>
							<CustomButton
								label={"Download"}
								textColor="#002855"
								bgColor="#f2C008"
								bordered
								borderSize="lg"
								type="submit"
							/>
						</div>
					</form>
				</GeneralModal>
			)}
			{(isPending || isFiltering || isDownloading) && (
				<CustomBackdrop open={true} text={"Please wait..."} />
			)}
		</Layout>
	);
}
