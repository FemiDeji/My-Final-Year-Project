import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import useUser from "../../hooks/auth/useUser";
import FileInput from "../../components/FileInput";
import CustomButton from "../../components/CustomButton";
import { useEffect, useState } from "react";
import useUpdateUser from "../../hooks/auth/useUpdateUser";
import CustomBackdrop from "../../components/CustomBackdrop";
import CustomSelectField from "../../components/CustomSelectField";
import { General_Grey, General_Yellow } from "../../constants/colors";

export default function UpdateUserDataForm() {
	const { user, profile } = useUser();
	const { updateUser, isUpdating } = useUpdateUser();

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm({});

	const [formData, setFormData] = useState({
		username: "",
		fullname: "",
		guardian_name: "",
		guardian_phone: "",
		department: "",
		level: "",
		room: "",
		phone: "",
		avatar: null,
	});

	const levelOption = [
		{ key: "100", value: "100" },
		{ key: "200", value: "200" },
		{ key: "300", value: "300" },
		{ key: "400", value: "400" },
		{ key: "500", value: "500" },
	];

	useEffect(() => {
		if (profile) {
			const newData = {
				username: profile?.username || "",
				email: user?.user?.email || "",
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

			//Set form values in react-hook-form dynamically
			Object.keys(newData).forEach((key) => {
				setValue(key, newData[key]);
			});
		}
	}, [profile, setValue, user?.user?.email]);

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		setFormData((prev) => ({ ...prev, avatar: file }));
	};

	const onSubmit = (data) => {
		updateUser({ ...data, avatar: formData.avatar });
	};

	const handleReset = () => {
		setFormData({
			username: profile?.username || "",
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
							label={"Username"}
							name="username"
							register={register("username")}
							required={false}
							readOnly
						/>
						<CustomInput
							label={"Email"}
							name="email"
							register={register("email")}
							required={false}
							readOnly
						/>
					</div>
					<div className="w-full flex flex-row xs:flex-col justify-center items-start gap-3 xs:gap-3">
						<CustomInput
							label={"Fullname"}
							name="fullname"
							register={register("fullname", {
								required: "Fullname is required",
							})}
							error={errors?.fullname?.message}
						/>
						<CustomInput
							name="phone"
							label={"Phone Number"}
							register={register("phone", {
								required: "Phone number is required",
							})}
							error={errors?.phone?.message}
						/>
					</div>
					{profile?.role === "user" && (
						<div className="w-full flex flex-row xs:flex-col justify-center items-start gap-3 xs:gap-3">
							<CustomInput
								name="guardian_name"
								label={"Guardian/Parent Name"}
								register={register(
									"guardian_name",
									profile?.role === "user" && {
										required: "Guardian/Parent name is required",
									}
								)}
								error={errors?.guardian_name?.message}
							/>
							<CustomInput
								name="guardian_phone"
								label={"Guardian Phone"}
								register={register(
									"guardian_phone",
									profile?.role === "user" && {
										required: "Guardian phone is required",
									}
								)}
								error={errors?.guardian_phone?.message}
							/>
						</div>
					)}
					{profile?.role === "user" && (
						<div className="w-full flex flex-row xs:flex-col justify-center items-start gap-3 xs:gap-3">
							<CustomSelectField
								name="level"
								label={"Level"}
								register={register(
									"level",
									profile?.role === "user" && { required: "Level is required" }
								)}
								options={levelOption}
								optionKey="key"
								optionLabel="value"
								initialValue={profile?.level}
								error={errors?.level?.message}
							/>
							<CustomInput
								name="room"
								label={"Room Number"}
								register={register(
									"room",
									profile?.role === "user" && {
										required: "Room number is required",
									}
								)}
								error={errors?.room?.message}
							/>
						</div>
					)}
					<div className="w-full flex flex-row xs:flex-col justify-start items-start gap-3 xs:gap-3">
						<CustomInput
							name="department"
							label={"Department"}
							register={register("department", {
								required: "Department is required",
							})}
							error={errors?.department?.message}
						/>

						<FileInput
							label={"Profile Photo"}
							register={register("avatar")}
							name="avatar"
							onChange={handleAvatarChange}
							required={false}
							error={errors?.avatar?.message}
						/>
					</div>
					<div className="ml-auto flex justify-end items-end gap-3 w-[35%] xs:w-[100%] mt-2">
						<CustomButton
							label={"Cancel"}
							bgColor={General_Grey}
							bordered
							borderSize="lg"
							type="reset"
							onClick={handleReset}
							disabled={isUpdating}
						/>
						<CustomButton
							label={"Update"}
							bgColor={General_Yellow}
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
