import CustomButton from "../../components/CustomButton";
import CustomSearchField from "../../components/CustomSearchField";
import Layout from "../../components/Layout";
import Table from "../../components/Table";

export default function Bookings() {
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
		<Layout title={"Bookings"}>
			<div className="bg-white rounded-lg shadow-sm flex flex-col w-full p-3">
				<div className="flex gap-7">
					<div className="justify-end w-full">
						<CustomSearchField placeholder={"Search"} borderRadius={"lg"} />
					</div>
					<div className="lg:w-[20%]">
						<CustomButton label={"Book Pass"} bgColor="#f2c008" bordered />
					</div>
				</div>
				<div>
					<Table headers={headers} data={[]} />
				</div>
			</div>
		</Layout>
	);
}
