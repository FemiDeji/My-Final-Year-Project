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
import {
	combineDateWithCurrentTime,
	dateDifference,
} from "../../helpers/dateAndTime";
import useCreateUpdateBooking from "../../hooks/booking/useCreateUpdateBooking";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/auth/useUser";
// import useCheckLocation from "../../hooks/useCheckLocation";
import { General_Grey, General_Yellow } from "../../constants/colors";

export default function CreateBookingForm() {
	const { profile, isPending } = useGetProfile();
	const [submitType, setSubmitType] = useState("");
	const [passType, setPassType] = useState("Short");
	const [userDetails, setUserDetails] = useState(null);
	const navigate = useNavigate();
	const [priority, setPriority] = useState("");

	const { profile: currentUser } = useUser();

	const addDays = (date, days) => {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result.toISOString().split("T")[0];
	};

	const startOffset = passType === "Long" ? 2 : 1;
	const defaultStartDate = addDays(new Date(), startOffset);
	const defaultEndDate = defaultStartDate;

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
		watch,
		reset,
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
			type: passType,
			destination: "",
			purpose: "",
			startDate: defaultStartDate,
			endDate: defaultEndDate,
			num_days: 0,
		},
	});

	const { createUpdateBooking, isBooking } = useCreateUpdateBooking();
	// const { withinLocation, locationChecked, RetryModal, locationCheckLoading } =
	// 	useCheckLocation();

	const username = watch("username");
	const isDisabled = !watch("fullname");

	const startDate = watch("startDate");
	const endDate = watch("endDate");
	const purpose = watch("purpose");

	const passTypeOptions = [
		{ key: "Short", value: "Short pass" },
		{ key: "Long", value: "Long pass" },
	];

	const priorityLevels = {
		High: ["medical check-up", "emergency", "family crisis", "funeral", "SDF"],
		Mid: ["wedding", "conference", "official assignment", "document update"],
	};

	const handleReset = () => {
		setValue("destination", "");
		setValue("startDate", "");
		setValue("endDate", "");
		setValue("type", "");

		reset();
	};
	useEffect(() => {
		if (startDate && endDate && passType === "Long") {
			const days = dateDifference(startDate, endDate);

			setValue("num_days", days);
		}
	}, [startDate, endDate, setValue, passType]);

	useEffect(() => {
		const refinedPurpose = purpose.toLowerCase();
		if (purpose) {
			if (
				priorityLevels.High.some((word) =>
					refinedPurpose.includes(word.toLowerCase())
				)
			) {
				setPriority("High");
			} else if (
				priorityLevels.Mid.some((word) =>
					refinedPurpose.includes(word.toLowerCase())
				)
			) {
				setPriority("Mid");
			} else {
				setPriority("Normal");
			}
		}
	}, [purpose, priorityLevels.High, priorityLevels.Mid]);

	const onSubmit = async (data) => {
		if (submitType === "fetchProfile") {
			try {
				const response = await profile(data.username);
				setUserDetails(response);
				console.log("response", response);
				if (response) {
					setValue("fullname", response.fullname);
					setValue("department", response.department);
					setValue("email", response.email);
					setValue("level", response.level);
					setValue("guardian_name", response.guardian_name);
					setValue("guardian_phone", response.guardian_phone);
					setValue("phone", response.phone);
					setValue("room", response.room);
				}
			} catch (err) {
				console.error(err.mesaage);
			}
		}
		if (submitType === "general") {
			const bookingData = {
				username: data.username,
				email: data.email,
				fullname: data.fullname,
				department: data.department,
				phone: data.phone,
				room: data.room,
				start_date: combineDateWithCurrentTime(data.startDate),
				end_date: combineDateWithCurrentTime(data.endDate),
				user_id: userDetails.id,
				guardian_name: data.guardian_name,
				guardian_phone: data.guardian_phone,
				type: data.type,
				destination: data.destination,
				purpose: data.purpose,
				num_days: data.num_days,
				priority,
			};

			createUpdateBooking(bookingData, { onSuccess: () => handleReset() });
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
		<Layout
			title={`New ${
				currentUser?.role === "super-admin" ? "Request" : "Booking"
			}`}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-5 mt-5 text-left py-2">
				<div className="flex flex-row xs:flex-col gap-3">
					<div className="w-full">
						<CustomInput
							name="username"
							label={"Matric No"}
							register={register("username", {
								pattern: {
									value: /^\d{2}\/\d{4}$/,
									message: "Matric number is invalid. Use a valid format",
								},
							})}
							error={errors?.username?.message}
							placeholder={"09/9876"}
							// readOnly={!withinLocation}
						/>

						{isDisabled && username?.length === 7 && !errors?.username && (
							<div className="w-full flex justify-end items-center">
								<button
									className="lg:w-[30%] xs:w-[35%] text-center text-[11px] mt-2 border rounded-full bg-general-yellow px-2 py-1 text-general-blue font-semibold ml-auto"
									onClick={() => {
										setSubmitType("fetchProfile");
									}}
									type="submit">
									Fetch
								</button>
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
						onChange={setPassType}
						optionKey="key"
						optionLabel="value"
						register={register(
							"type",
							submitType === "general" && !passType
								? { required: "Pass type is required" }
								: false
						)}
						error={errors?.type?.message}
						initialValue="Short"
					/>
				</div>
				<div className="flex flex-row xs:flex-col gap-3">
					<CustomInput
						name="startDate"
						label={`${passType === "Long" ? "Start" : ""} Date`}
						type="date"
						disabled={isDisabled}
						register={register(
							"startDate",

							{
								required:
									submitType === "general" ? "Start date is required" : false,
								validate: (value) => {
									const today = new Date();
									today.setHours(0, 0, 0, 0);

									const selectedDate = new Date(value);
									selectedDate.setHours(0, 0, 0, 0);

									const diffInDays = Math.floor(
										(selectedDate - today) / (1000 * 60 * 60 * 24)
									);

									if (passType === "Short" && diffInDays <= 0) {
										return "Short pass must be booked a day ahead";
									}

									if (passType === "Long" && diffInDays <= 1) {
										return "Long pass must be booked at least 2 days ahead";
									}

									if (passType === "Long" && value <= getValues().endDate) {
										return "Start date cannot be after end date";
									}
								},
							}
						)}
						error={errors?.startDate?.message}
					/>

					{passType === "Long" && (
						<CustomInput
							name="endDate"
							label={"End Date"}
							type="date"
							disabled={isDisabled}
							register={register(
								"endDate",
								submitType === "general" && passType === "Long"
									? {
											required: "End date is required",
											validate: (value) =>
												// console.log(value < getValues().startDate),
												value >= getValues().startDate ||
												"End date cannot be before start date",
									  }
									: false
							)}
							error={errors?.endDate?.message}
						/>
					)}
				</div>

				<div className="flex flex-row xs:flex-col gap-3">
					{passType === "Long" && (
						<CustomInput
							name="num_days"
							label={"Number of Days"}
							register={register("num_days", {
								validate: (value) => {
									if (passType === "Long" && Number(value < 0)) {
										return "A long pass must be more than a day";
									}
									return true;
								},
							})}
							readOnly
							error={errors?.num_days?.message}
						/>
					)}

					<CustomSelectField
						name="destination"
						label={"Destination"}
						readOnly={isDisabled}
						placeholder={"State"}
						options={states}
						optionKey="state"
						optionLabel="state"
						register={register(
							"destination",
							submitType === "general"
								? {
										required: "Destination is required",
								  }
								: false
						)}
						error={errors?.destination?.message}
					/>
				</div>
				<div className="w-full">
					<CustomTextarea
						label={"Purpose"}
						name="purpose"
						placeholder={"Write your purpose here."}
						disabled={isDisabled}
						register={register(
							"purpose",
							submitType === "general" && { required: "Purpose is required" }
						)}
						error={errors?.purpose?.message}
					/>
				</div>

				<div className="flex flex-row justify-center xs:justify-end items-center xs:items-end gap-3 w-[30%] ml-auto xs:w-full xs:m-0">
					<CustomButton
						label={"Cancel"}
						bgColor={General_Grey}
						bordered
						borderSize="lg"
						onClick={() => {
							navigate(
								currentUser?.role === "super-admin" ? "/requests" : "/bookings"
							);
							reset();
						}}
						disabled={isBooking}
					/>
					<CustomButton
						label={"Submit"}
						onClick={() => {
							setSubmitType("general");
							console.log("clicked");
						}}
						bordered
						bgColor={General_Yellow}
						type="submit"
						disabled={isDisabled || isBooking}
					/>
				</div>
			</form>
			{/* {locationCheckLoading ? (
				<CustomBackdrop open={true} text={"Checking location..."} />
			) : (
				RetryModal
			)} */}
			{(isPending || isBooking) && (
				<CustomBackdrop
					open={true}
					text={
						isBooking ||
						{
							/*!locationChecked*/
						}
							? "Please wait..."
							: "Fetching profile..."
					}
				/>
			)}
		</Layout>
	);
}
