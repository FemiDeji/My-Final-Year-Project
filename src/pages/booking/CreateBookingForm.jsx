import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";

export default function CreateBookingForm({ setStudentDetails, close }) {
	return (
		<div className="flex flex-col gap-5 mt-5 text-left py-2">
			<div className="flex flex-row xs:flex-col gap-3">
				<CustomInput name="username" label={"Matric No"} />
				<CustomInput name="fullname" label={"Fullname"} readOnly />
			</div>
			<div className="flex flex-row xs:flex-col gap-3">
				<CustomInput name="department" label={"Department"} readOnly />
				<CustomInput name="email" label={"Email"} readOnly />
			</div>
			<div className="flex flex-row xs:flex-col gap-3">
				<CustomInput name="level" label={"Level"} readOnly />
				<CustomInput name="guardian_name" label={"Guardian Name"} readOnly />
			</div>
			<div className="flex flex-row xs:flex-col gap-3">
				<CustomInput name="phone" label={"Phone"} readOnly />
				<CustomInput name="room" label={"Room"} readOnly />
			</div>
			<div className="flex flex-row justify-center xs:justify-end items-center xs:items-end gap-3 w-[30%] ml-auto xs:w-full xs:m-0">
				<CustomButton
					label={"Cancel"}
					bgColor="#DFE6EC"
					bordered
					borderSize="lg"
					onClick={() => close()}
				/>
				<CustomButton label={"Submit"} bordered bgColor="#f2c008" />
			</div>
		</div>
	);
}
