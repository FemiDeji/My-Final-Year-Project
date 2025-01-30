import { FaPlus } from "react-icons/fa";
import CustomButton from "../../components/CustomButton";
import CustomSearchField from "../../components/CustomSearchField";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import { useState } from "react";
import GeneralModal from "../../components/GeneralModal";
import CreateBookingForm from "./CreateBookingForm";

export default function Bookings() {
	const [showBookingModal, setShowBookingModal] = useState(false);
	const [studentDetails, setStudentDetails] = useState(null);

	const headers = [
		{ key: "matric_no", value: "Matric No" },
		{ key: "fullname", value: "Full Name" },
		// { key: "phone_no", value: "Phone No" },
		{ key: "department", value: "Department" },
		// { key: "room_no", value: "Room No" },
		// { key: "guardian_name", value: "Guardian Name" },
		// { key: "guardian_phone_contact", value: "Guardian Phone No" },
		// { key: "type", value: "Type" },
		{ key: "destination", value: "Destination" },
		// { key: "purpose", value: "Purpose" },
		// { key: "start_date", value: "Start Date" },
		// { key: "end_date", value: "End Date" },
		{ key: "status", value: "Status" },
	];

	return (
		<Layout title={"Bookings"}>
			<div className="bg-white rounded-lg shadow-sm flex flex-col w-full p-3">
				<div className="flex gap-4 justify-end items-center">
					<div className="justify-end w-full lg:w-[40%] xs:hidden">
						<CustomSearchField placeholder={"Search"} borderRadius={"lg"} />
					</div>
					<div className="lg:w-[20%]">
						<CustomButton
							label={"Book Pass"}
							bgColor="#f2c008"
							textColor="#002855"
							bordered
							onClick={() => setShowBookingModal(true)}>
							<FaPlus />
						</CustomButton>
					</div>
				</div>
				<div>
					<Table headers={headers} data={[]} isView />
				</div>
			</div>

			<GeneralModal
				isOpen={showBookingModal}
				widthClass="w-full"
				onClose={() => setShowBookingModal(false)}
				showCloseButton>
				<CreateBookingForm
					setStudentDetails={setStudentDetails}
					close={setShowBookingModal}
				/>
			</GeneralModal>
		</Layout>
	);
}
