import { FaFilter } from "react-icons/fa";
import CustomButton from "../../components/CustomButton";
import CustomSearchField from "../../components/CustomSearchField";
import Layout from "../../components/Layout";
import Table from "../../components/Table";

export default function History() {
	const headers = [
		{ key: "matric_no", value: "Matric No" },
		{ key: "fullname", value: "Full Name" },
		{ key: "phone_no", value: "Phone No" },
		{ key: "department", value: "Department" },
		{ key: "room_no", value: "Room No" },
		{ key: "guardian_name", value: "Guardian Name" },
		{ key: "guardian_phone_contact", value: "Guardian Phone No" },
		{ key: "type", value: "Type" },
		{ key: "destination", value: "destination" },
		{ key: "purpose", value: "Purpose" },
		{ key: "start_date", value: "Start Date" },
		{ key: "end_date", value: "End Date" },
		{ key: "status", value: "Status" },
	];

	return (
		<Layout title={"History"}>
			<div className="bg-white rounded-lg p-3 shadow-sm flex flex-col w-full">
				<div className="flex justify-end items-center gap-3 w-full">
					<div className="lg:w-[40%]">
						<CustomSearchField
							placeholder={"Search history"}
							borderRadius={"lg"}
							name={"searchHistory"}
						/>
					</div>
					<div className="lg:w-[20%]">
						<CustomButton
							label={"Filter History"}
							bgColor="#f2c008"
							textColor="#002855"
							bordered
							borderSize="lg">
							<FaFilter />
						</CustomButton>
					</div>
				</div>
				<div className="mt-1">
					<Table headers={headers} data={[]} />
				</div>
			</div>
		</Layout>
	);
}
