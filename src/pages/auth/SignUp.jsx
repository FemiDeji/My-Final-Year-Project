import { useForm } from "react-hook-form";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import CustomSelectField from "../../components/CustomSelectField";
import { useState } from "react";
import CustomOptionsFilter from "../../components/CustomOptionsFilter";
import { useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import useSignup from "../../hooks/auth/useSignup";
import CustomBackdrop from "../../components/CustomBackdrop";
import { delayAction } from "../../helpers/custom";
import { General_Blue, General_Yellow } from "../../constants/colors";

export default function SignUp() {
	const [levels, setLevels] = useState("");
	const [activeType, setActiveType] = useState("user");
	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const { signup, isSigningUp } = useSignup();
	const {
		register,
		reset,
		formState: { errors },
		handleSubmit,
		getValues,
		setValue,
	} = useForm({
		defaultValues: {
			username: "",
			password: "",
			fullname: "",
			email: "",
			phone: "",
			department: "",
			level: "",
			room: "",
			guardian_name: "",
			guardian_phone: "",
			role: "",
			confirmPassword: "",
		},
		mode: "onBlur",
	});

	const levelOption = [
		{ key: "100", value: "100" },
		{ key: "200", value: "200" },
		{ key: "300", value: "300" },
		{ key: "400", value: "400" },
		{ key: "500", value: "500" },
	];
	const roleOptions = [
		{ label: "User", value: "user" },
		{ label: "Admin", value: "admin" },
		{ label: "Security", value: "security" },
	];

	const handleLevelChange = (level) => {
		setLevels(level);
		setValue("level", level);
	};

	const handleRoleChange = (role) => {
		setActiveType(role);
		setValue("role", role);
		reset();
	};

	const onSubmit = (data) => {
		signup({ ...data, role: activeType });
		console.log({ ...data, role: activeType });
	};

	return (
		<div
			className={`flex flex-row justify-center items-center w-full h-screen`}>
			<div className="flex flex-col justify-center items-center h-full xs:hidden w-[50%] ">
				<img
					src="/AU_Senate_Building.jpg"
					alt="Senate Building"
					className="object-cover h-full"
				/>
			</div>

			<div
				className={`xs:w-full xs:h-screen w-[50%] flex flex-col justify-center items-center h-screen`}>
				<div className="w-full h-screen">
					<div className="w-full flex justify-center items-center">
						<img
							src="AU_logo.jpg"
							alt="AU logo"
							className="object-contain object-center h-[70px] my-3 xs:h-[50px]"
						/>
					</div>
					<div className="text-general-blue font-semibold text-xl xl:text-base text-center xs:mx-auto">
						Welcome To
						<div className="text-general-blue text-sm font-medium xs:text-[0.8rem]">
							PASS-BOOKING SYSTEM
						</div>
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex xs:flex-col xs:items-start flex-col justify-between items-center w-full mb-3 gap-5 lg:gap-8 mt-3 xs:pl-4">
							<div className="xs:pl-5 lg:pl-5 xs:mt-2 w-[40%] flex flex-row gap-2 justify-center items-center lg:mr-auto">
								<span className="text-general-blue text-[1rem] xs:text-[0.9rem] font-medium">
									Role:{" "}
								</span>
								<CustomOptionsFilter
									options={roleOptions}
									setActiveType={handleRoleChange}
									activeType={activeType}
									className="xs:text-[0.8rem]"
									btnClassName="xs:text-[0.8rem]"
								/>
							</div>
						</div>
						<div
							className={`flex flex-col justify-start items-center gap-2 w-full px-5 ${
								activeType === "user" ? "h-[60vh] overflow-y-auto" : "h-auto"
							}`}>
							<div className="w-full flex flex-col justify-center items-center gap-4">
								<div className="w-full xs:flex-col flex justify-center items-start gap-3">
									<CustomInput
										label={activeType === "user" ? "Matric No" : "Staff No"}
										name="username"
										register={register("username", {
											required: "Username is required",
											pattern: {
												value:
													activeType === "user"
														? /^\d{2}\/\d{4}$/
														: /^AU\/\d{4}-\d{4}$/,
												message:
													activeType === "user"
														? "Matric number is invalid. Use a valid format."
														: "Staff number is invalid. Use a valid format.",
											},
										})}
										error={errors?.username?.message}
										placeholder={
											activeType === "user" ? "02/1021" : "AU/2024-0151"
										}
									/>
									<CustomInput
										label={"Fullname"}
										name="fullname"
										register={register("fullname", {
											required: "Fullname is required",
										})}
										error={errors?.fullname?.message}
										placeholder={"John Doe"}
									/>
								</div>
								<div className="w-full xs:flex-col flex justify-center items-start gap-3">
									<CustomInput
										label={"Email"}
										name="email"
										register={register("email", {
											required: "Email is required",
											pattern: {
												value: /^[^s@]+@[^s@]+.[^s@]+$/,
												message: "Invalid email format",
											},
										})}
										error={errors?.email?.message}
										placeholder={"johndoe@gmail.com"}
									/>
									<CustomInput
										label={"Phone Number"}
										name="phone"
										register={register("phone", {
											required: "Phone Number is required",
										})}
										error={errors?.phone?.message}
										placeholder={"09013647832"}
									/>
								</div>
								{activeType === "user" && (
									<div className="w-full xs:flex-col flex justify-center items-start gap-3">
										<CustomInput
											label={"Department"}
											name="department"
											register={register("department", {
												required:
													activeType === "user"
														? "Department is required"
														: false,
											})}
											error={errors?.department?.message}
											placeholder={"Computer Science"}
										/>
										<CustomInput
											label={"Guardian/Parent Name"}
											name="guardian_name"
											register={register(
												"guardian_name",
												activeType === "user" && {
													required: "Guardian name field is required",
												}
											)}
											error={errors?.guardian_name?.message}
											placeholder={"Jane Doe"}
										/>
									</div>
								)}
								{activeType === "user" && (
									<div className="w-full xs:flex-col flex justify-center items-start gap-3">
										<CustomInput
											label={"Room Number"}
											name="room"
											register={register(
												"room",
												activeType === "user" && {
													required: "Room Number is required",
													pattern: {
														value: /^[A-I](1[0-9]|2[0-2]|\d)$/,
														message: "Invalid room number.",
													},
												}
											)}
											error={errors?.room?.message}
											placeholder={"A1"}
										/>
										{activeType === "user" && (
											<CustomSelectField
												label={"Level"}
												name={"level"}
												register={register(
													"level",
													activeType === "user" && {
														required: "Level is required",
													}
												)}
												options={levelOption}
												optionKey="key"
												optionLabel="value"
												onChange={handleLevelChange}
												error={errors?.level?.message}
												placeholder="Select your level"
											/>
										)}
									</div>
								)}
								{activeType === "user" && (
									<div className="w-full xs:flex-col flex justify-center items-start gap-3">
										<CustomInput
											label={"Guardian/Parent Phone"}
											name={"guardian_phone"}
											register={register(
												"guardian_phone",
												activeType === "user" && {
													required: "Guardian/Parent phone is required",
												}
											)}
											error={errors?.guardian_phone?.message}
											placeholder={"09078342209"}
										/>
									</div>
								)}
								<div className="w-full xs:flex-col flex justify-center items-start gap-3">
									<div className="w-full relative">
										<CustomInput
											label={"Password (min 8 chars)"}
											name="password"
											register={register("password", {
												required: "Password is required",
												minLength: {
													value: 8,
													message: "Password must be at least 8 characters",
												},
											})}
											error={errors?.password?.message}
											type={showPassword ? "text" : "password"}
										/>
										<span
											className={`absolute right-3 ${
												errors.password ? "top-[45%]" : "top-[57%]"
											} transform -translate-y-1/2 cursor-pointer text-gray-500`}
											onClick={() => setShowPassword(!showPassword)}>
											{showPassword ? (
												<MdVisibilityOff size={24} />
											) : (
												<MdVisibility size={24} />
											)}
										</span>
									</div>
									<div className="relative w-full">
										<CustomInput
											label={"Confirm Password"}
											name="confirmPassword"
											register={register("confirmPassword", {
												required: "Confirm Password is required",
												validate: (value) =>
													value === getValues().password ||
													"Passwords do not match",
											})}
											error={errors?.confirmPassword?.message}
											type={showPassword2 ? "text" : "password"}
										/>
										<span
											className={`absolute right-3 ${
												errors.password ? "top-[45%]" : "top-[57%]"
											} transform -translate-y-1/2 cursor-pointer text-gray-500`}
											onClick={() => setShowPassword2(!showPassword2)}>
											{showPassword2 ? (
												<MdVisibilityOff size={24} />
											) : (
												<MdVisibility size={24} />
											)}
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="flex gap-3 justify-between items-center w-full ml-auto mt-2 px-4">
							<div className="xs:w-[40%] w-[30%]">
								<CustomButton
									label={"Back to Login"}
									textColor={General_Blue}
									bgColor={General_Yellow}
									bordered
									borderSize="lg"
									onClick={() => {
										setIsLoading(true);
										delayAction(() => {
											setIsLoading(false);
											navigate("/login");
										}, 2000);
									}}
									disabled={isSigningUp}
								/>
							</div>
							<div className="w-[30%]">
								<CustomButton
									label={"Sign up"}
									textColor={General_Blue}
									bgColor={General_Yellow}
									bordered
									borderSize="lg"
									type="submit"
									disabled={isSigningUp}
								/>
							</div>
						</div>
					</form>
				</div>
			</div>
			{(isSigningUp || isLoading) && (
				<CustomBackdrop open={true} text={"Please wait..."} />
			)}
		</div>
	);
}
