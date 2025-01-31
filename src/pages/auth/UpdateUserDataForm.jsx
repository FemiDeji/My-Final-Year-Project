import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import useUser from "../../hooks/auth/useUser";
import FileInput from "../../components/FileInput";
import CustomButton from "../../components/CustomButton";
import { useEffect, useState } from "react";
import useUpdateUser from "../../hooks/auth/useUpdateUser";
import CustomBackdrop from "../../components/CustomBackdrop";

export default function UpdateUserDataForm() {
	const { user, profile } = useUser();
	const { updateUser, isUpdating } = useUpdateUser();
	console.log("user", profile);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm({});

	const [formData, setFormData] = useState({
		fullname: "",
		guardian_name: "",
		guardian_phone: "",
		department: "",
		level: "",
		room: "",
		phone: "",
		avatar: null,
	});

	useEffect(() => {
		if (profile) {
			const newData = {
				email: user?.email || "",
				fullname: profile?.fullname || "",
				guardian_name: profile?.guardian_name || "",
				guardian_phone: profile?.guardian_phone || "",
				department: profile?.department || "",
				level: profile?.level || "",
				room: profile?.room || "",
				phone: profile?.phone || "",
				avatar: profile?.avatar || null,
			};

			setFormData(newData);

			// 🟢 Set form values in react-hook-form dynamically
			Object.keys(newData).forEach((key) => {
				setValue(key, newData[key]);
			});
		}
	}, [profile, setValue, user?.email]);

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		setFormData((prev) => ({ ...prev, avatar: file }));
	};

	const onSubmit = (data) => {
		updateUser({ ...data, avatar: formData.avatar });
		console.log("update data:", { ...data });
	};

	const handleReset = () => {
		setFormData({
			fullname: profile?.fullname || "",
			guardian_name: profile?.guardian_name || "",
			guardian_phone: profile?.guardian_phone || "",
			department: profile?.department || "",
			level: profile?.level || "",
			room: profile?.room || "",
			phone: profile?.phone || "",
			avatar: profile?.avatar || null,
		});

		reset();
	};

	return (
		<div className="w-full rounded-lg bg-white p-4">
			<div className="font-medium text-general-blue text-xl">Update Data</div>
			<form onSubmit={handleSubmit(onSubmit)} className="mt-2 w-full">
				<div className="flex justify-center items-center flex-col gap-3">
					<div className="w-full flex flex-row xs:flex-col justify-center items-start gap-3 xs:gap-3">
						<CustomInput
							label={"Email"}
							name="email"
							register={register("email")}
							readOnly
						/>
						<CustomInput
							label={"Fullname"}
							name="fullname"
							register={register("fullname")}
						/>
					</div>
					{profile?.role === "user" && (
						<div className="w-full flex flex-row xs:flex-col justify-center items-start gap-3 xs:gap-3">
							<CustomInput
								name="guardian_name"
								label={"Guardian/Parent Name"}
								register={register("guardian_name")}
							/>
							<CustomInput
								name="guardian_phone"
								label={"Guardian Phone"}
								register={register("guardian_phone")}
							/>
						</div>
					)}
					<div className="w-full flex flex-row xs:flex-col justify-center items-start gap-3 xs:gap-3">
						<CustomInput
							name="department"
							label={"Department"}
							register={register("department")}
						/>
						<CustomInput
							name="phone"
							label={"Phone Number"}
							register={register("phone")}
						/>
					</div>
					{profile?.role === "user" && (
						<div className="w-full flex flex-row xs:flex-col justify-center items-start gap-3 xs:gap-3">
							<CustomInput
								name="level"
								label={"Level"}
								register={register("level")}
							/>
							<CustomInput
								name="room"
								label={"Room Number"}
								register={register("room")}
							/>
						</div>
					)}
					<div className="w-full flex flex-row xs:flex-col justify-start items-start gap-3 xs:gap-3">
						<FileInput
							label={"Profile Photo"}
							register={register("avatar")}
							name="avatar"
							onChange={handleAvatarChange}
						/>
					</div>
					<div className="ml-auto flex justify-end items-end gap-3 w-[35%] xs:w-[100%] mt-2">
						<CustomButton
							label={"Cancel"}
							bgColor="#DFE6EC"
							bordered
							borderSize="lg"
							type="reset"
							onClick={handleReset}
							disabled={isUpdating}
						/>
						<CustomButton
							label={"Update"}
							bgColor="#f2c008"
							bordered
							borderSize="lg"
							type="submit"
							disabled={isUpdating}
						/>
					</div>
				</div>
			</form>
			{isUpdating && <CustomBackdrop open={true} text={"Please wait..."} />}
		</div>
	);
}
