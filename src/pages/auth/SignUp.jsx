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

export default function SignUp() {
	const [levels, setLevels] = useState("");
	const [activeType, setActiveType] = useState("user");
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	const { signup, isSigningUp } = useSignup();
	const {
		register,
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
	];

	const handleLevelChange = (level) => {
		setLevels(level);
		setValue("level", level);
	};

	const handleRoleChange = (role) => {
		setActiveType(role);
		setValue("role", role);
	};

	const onSubmit = (data) => {
		signup({ ...data, role: activeType });
		console.log({ ...data, role: activeType });
	};

	return (
		<div
			className={`min-h-screen h-full "xs:min-h-[150vh]" : "xs:min-h-full" flex flex-row justify-center items-center w-full xs:overflow-y-auto`}>
			<div className="bg-general-yellow flex flex-col justify-center items-center xs:w-0 w-[50%] h-full">
				<img
					src="/AU_Senate_Building.jpg"
					alt="Senate Building"
					className="object-cover object-center h-full xs:hidden"
				/>
			</div>
			<div className="xs:w-full w-[50%] flex flex-col justify-center items-center h-full xs:min-h-screen xs:h-[100%] overflow-auto">
				<div className="w-full flex justify-center items-center mb-3">
					<img
						src="AU_logo.jpg"
						alt="AU logo"
						className="object-contain object-left h-[70px]"
					/>
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col justify-start items-start gap-2 w-full p-5">
					<div className="flex xs:flex-col xs:items-start flex-row justify-between items-center w-full mb-3">
						<div className="text-general-blue font-semibold text-xl text-left">
							Welcome
							<div className="text-general-blue text-sm font-medium">
								PASS-BOOK MANAGEMENT SYSTEM
							</div>
						</div>
						<div className="xs:pl-6 xs:mt-2 w-[40%] flex flex-row gap-2 justify-center items-center">
							<span className="text-general-blue text-[1rem] font-medium">
								Role:{" "}
							</span>
							<CustomOptionsFilter
								options={roleOptions}
								setActiveType={handleRoleChange}
								activeType={activeType}
							/>
						</div>
					</div>
					<div className="w-full flex flex-col justify-center items-center gap-4">
						<div className="w-full xs:flex-col flex justify-center items-start gap-3">
							<CustomInput
								label={"Username"}
								name="username"
								register={register("username", {
									required: "Username is required",
								})}
								error={errors?.username?.message}
								placeholder={activeType === "user" ? "02/1021" : "SN09245"}
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
						<div className="w-full xs:flex-col flex justify-center items-start gap-3">
							<CustomInput
								label={"Department"}
								name="department"
								register={register("department", {
									required: "Department is required",
								})}
								error={errors?.department?.message}
								placeholder={"Computer Science"}
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
						{activeType === "user" && (
							<div className="w-full xs:flex-col flex justify-center items-start gap-3">
								<CustomInput
									label={"Room Number"}
									name="room"
									register={register(
										"room",
										activeType === "user" && {
											required: "Room Number is required",
										}
									)}
									error={errors?.room?.message}
									placeholder={"A1"}
								/>
								<CustomInput
									label={"Guardian/Parent Name"}
									name="guardian_name"
									register={register(
										"guardian_name",
										activeType === "user" && {
											required: "This field is required",
										}
									)}
									error={errors?.guardian_name?.message}
									placeholder={"Jane Doe"}
								/>
							</div>
						)}
						<div className="w-full xs:flex-col flex justify-center items-start gap-3">
							<div className="w-full relative">
								<CustomInput
									label={"Password"}
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
									type={"password"}
								/>
							</div>
						</div>
					</div>

					<div className="flex gap-3 justify-between items-center w-full ml-auto mt-2">
						<div className="xs:w-[40%] w-[30%]">
							<CustomButton
								label={"Back to Login"}
								textColor="#002855"
								bgColor="#f2c008"
								bordered
								borderSize="lg"
								onClick={() => navigate("/login")}
								disabled={isSigningUp}
							/>
						</div>
						<div className="w-[30%]">
							<CustomButton
								label={"Sign up"}
								textColor="#002855"
								bgColor="#f2c008"
								bordered
								borderSize="lg"
								type="submit"
								disabled={isSigningUp}
							/>
						</div>
					</div>
				</form>
			</div>
			{isSigningUp && <CustomBackdrop open={true} text={"Please wait..."} />}
		</div>
	);
}
