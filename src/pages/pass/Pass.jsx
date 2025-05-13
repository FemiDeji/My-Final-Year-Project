import { useState } from "react";
import CustomBackdrop from "../../components/CustomBackdrop";
import GeneralModal from "../../components/GeneralModal";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import usePasses from "../../hooks/pass/usePasses";
import CustomLabelValue from "../../components/CustomLabelValue";

export default function Pass() {
	const [showPassDetails, setShowPassDetails] = useState(false);
	const [selectedPass, setSelectedPass] = useState(null);

	const today = new Date().toISOString().split("T")[0];
	const beginningOfYear = new Date(new Date().getFullYear(), 0, 1)
		.toISOString()
		.split("T")[0];

	const { passes, isPending } = usePasses();
	console.log("passes", passes);

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

	const exemptedKeys = ["id", "user_id", "created_at", "rejection_reason"];

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
		priority: "Priority",
		admin_name: "Staff Name",
		admin_username: "Staff ID",
	};

	const handleViewClick = (id) => {
		const result = passes.find((pass) => pass.id == id);
		setSelectedPass({ ...result });
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
				<form>
					<div className="grid grid-cols-2 xs:flex xs:flex-col w-full gap-2 items-center text-left p-4">
						{selectedPass &&
							Object.entries(selectedPass)
								.filter(([key]) => !exemptedKeys.includes(key))
								.map(([a, b]) => {
									return (
										<CustomLabelValue key={a} label={labels[a]} value={b} />
									);
								})}
					</div>
				</form>
			</GeneralModal>

			{isPending && <CustomBackdrop open={true} text={"Fetching data..."} />}
		</Layout>
	);
}
