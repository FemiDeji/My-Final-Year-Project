import { useForm } from "react-hook-form";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import CustomSelectField from "../../components/CustomSelectField";
import Layout from "../../components/Layout";
import useGetProfile from "../../hooks/profile/useGetProfile";
import { useEffect, useState } from "react";
import CustomBackdrop from "../../components/CustomBackdrop";
import CustomTextarea from "../../components/CustomTextarea";
import { states } from "../../helpers/states";

export default function CreateBookingForm() {
	const { profile, isPending } = useGetProfile();
	const [submitType, setSubmitType] = useState("");
	const [passType, setPassType] = useState("short");

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			username: "",
			fullname: "",
			department: "",
			email: "",
			level: "",
			guardian_name: "",
			guardian_phone: "",
			phone: "",
			room: "",
			type: "",
			destination: "",
			purpose: "",
			startDate: new Date(),
			endDate: "",
			num_days: 0,
		},
	});

	const username = watch("username");
	const isDisabled = !watch("fullname");

	const passTypeOptions = [
		{ key: "short", value: "Short pass" },
		{ key: "long", value: "Long pass" },
	];

	const handlePassTypeOptionChange = (type) => {
		setPassType(type);
		setValue("type", type);
	};

	const onSubmit = async (data) => {
		if (submitType === "fetchProfile") {
			try {
				const response = await profile(data.username);
				console.log("response", response);
				if (response) {
					setValue("fullname", response.fullname);
					setValue("department", response.department);
					setValue("email", response.email);
					setValue("level", response.level);
					setValue("guardian_name", response.guardian_name);
					setValue("guardian_phone", response.guardian_phone);
					setValue("guardian_name", response.guardian_name);
					setValue("phone", response.phone);
					setValue("room", response.room);
				}
			} catch (err) {
				console.error(err.mesaage);
			}
		}
	};

	useEffect(() => {
		if (!username) {
			// Clear the fetched data when username is empty
			setValue("fullname", "");
			setValue("department", "");
			setValue("email", "");
			setValue("level", "");
			setValue("guardian_name", "");
			setValue("guardian_phone", "");
			setValue("phone", "");
			setValue("room", "");
		}
	}, [username, setValue]);

	return (
		<Layout title={"New Booking"}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-5 mt-5 text-left py-2">
				<div className="flex flex-row xs:flex-col gap-3">
					<div className="w-full">
						<CustomInput
							name="username"
							label={"Matric No"}
							register={register("username")}
							placeholder={"09/9876"}
						/>

						{(isDisabled || !username) && (
							<div className="w-full flex justify-end items-center">
								{username?.length === 7 && (
									<button
										className="lg:w-[30%] xs:w-[35%] text-center text-[11px] mt-2 border rounded-full bg-general-yellow px-2 py-1 text-general-blue font-semibold ml-auto"
										onClick={() => {
											setSubmitType("fetchProfile");
										}}
										type="submit">
										Fetch
									</button>
								)}
							</div>
						)}
					</div>
					<CustomInput
						name="fullname"
						label={"Fullname"}
						register={register("fullname")}
						readOnly
						error={errors?.fullname?.message}
					/>
				</div>
				<div className="flex flex-row xs:flex-col gap-3">
					<CustomInput
						name="email"
						label={"Email"}
						register={register("email")}
						readOnly
						error={errors?.email?.message}
					/>
					<CustomInput
						name="department"
						label={"Department"}
						register={register("department")}
						readOnly
						error={errors?.department?.message}
					/>
				</div>
				<div className="flex flex-row xs:flex-col gap-3">
					<CustomInput
						name="level"
						label={"Level"}
						register={register("level")}
						readOnly
						error={errors?.level?.message}
					/>
					<CustomInput
						name="phone"
						label={"Phone"}
						register={register("phone")}
						readOnly
						error={errors?.phone?.message}
					/>
				</div>
				<div className="flex flex-row xs:flex-col gap-3">
					<CustomInput
						name="room"
						label={"Room"}
						register={register("room")}
						readOnly
						error={errors?.room?.message}
					/>
					<CustomInput
						name="guardian_name"
						label={"Guardian Name"}
						register={register("guardian_name")}
						readOnly
						error={errors?.guardian_name?.message}
					/>
				</div>
				<div className="flex flex-row xs:flex-col gap-3">
					<CustomInput
						name="guardian_phone"
						label={"Guardian Phone"}
						register={register("guardian_phone")}
						error={errors?.guardian_phone?.message}
						readOnly
					/>
					<CustomSelectField
						name="type"
						label={"Pass Type"}
						readOnly={isDisabled}
						options={passTypeOptions}
						optionKey="key"
						optionLabel="value"
						onChange={handlePassTypeOptionChange}
						initialValue="short"
					/>
				</div>
				<div className="flex flex-row xs:flex-col gap-3">
					<CustomSelectField
						name="destination"
						label={"Destination"}
						readOnly={isDisabled}
						placeholder={"State"}
						options={states}
						optionKey="state"
						optionLabel="state"
					/>

					<CustomInput
						name="startDate"
						label={"Start Date"}
						type="date"
						disabled={isDisabled}
						register={register(
							"startDate",
							submitType === "general" && {
								required: "Start date is required",
							}
						)}
						error={errors?.startDate?.message}
					/>
				</div>
				<div className="flex flex-row xs:flex-col gap-3">
					{passType === "long" && (
						<CustomInput
							name="endDate"
							label={"End Date"}
							type="date"
							disabled={isDisabled}
							register={register(
								"endDate",
								(submitType === "general" || passType === "long") && {
									required: "End date is required",
								}
							)}
							error={errors?.endDate?.message}
						/>
					)}
					<CustomInput name="num_days" label={"Number of Days"} readOnly />
				</div>
				<div className="w-full">
					<CustomTextarea
						label={"Purpose"}
						placeholder={"Write your purpose here."}
						disabled={isDisabled}
						register={register(
							"purpose",
							submitType === "general" && { required: "Purpose is required" }
						)}
					/>
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
			</form>
			{isPending && <CustomBackdrop open={true} text={"Fetching profile..."} />}
		</Layout>
	);
}
