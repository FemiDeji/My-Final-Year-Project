import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import { useEffect, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import CustomButton from "../../components/CustomButton";
import { useLocation, useNavigate } from "react-router-dom";
import useUpdatePassword from "../../hooks/auth/useUpdatePassword";
import CustomBackdrop from "../../components/CustomBackdrop";
import { delayAction } from "../../helpers/custom";

export default function ResetPassword() {
	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);
	const [isChecking, setIsChecking] = useState(true);

	const navigate = useNavigate();
	const location = useLocation();

	const { updatePassword, isUpdating } = useUpdatePassword();

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
		reset,
	} = useForm({ defaultValues: { newPassword: "", confirmPassword: "" } });

	const onSubmit = (data) => {
		console.log("new password", data);
		updatePassword(data.newPassword, {
			onSuccess: () => {
				reset({ newPassword: "", confirmPassword: "" });
				delayAction(() => {
					navigate("/login");
				}, 2000);
			},
		});
	};

	useEffect(() => {
		const hashParams = new URLSearchParams(location.hash.replace("#", "?"));
		const errorCode = hashParams.get("error_code");

		if (errorCode === "otp_expired") {
			navigate("/reset-password-expired");
		} else {
			setIsChecking(false);
		}
	}, [location.hash, navigate]);

	if (isChecking) {
		return <CustomBackdrop open={true} text={"Checking link..."} />;
	}

	return (
		<>
			<div className="h-full min-h-screen flex flex-row justify-center items-center w-full">
				<div className="flex flex-col justify-center items-center xs:w-0 w-[50%] h-full">
					<img
						src="/AU_Senate_Building.jpg"
						alt="Senate Building"
						className="object-cover object-center h-full xs:hidden"
					/>
				</div>
				<div className="xs:w-full w-[50%] flex flex-col justify-center items-center">
					<div className="w-full flex justify-center items-center mb-3">
						<img
							src="AU_logo.jpg"
							alt="AU logo"
							className="object-contain object-left h-[70px] xs:h-[50px]"
						/>
					</div>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col justify-start items-start gap-3 w-[70%] xs:w-[90%] mt-3">
						<div className="text-general-blue text-base font-medium mb-3">
							Reset Password
						</div>
						<div className="w-full relative">
							<CustomInput
								label={"New Password"}
								name="newPassword"
								register={register("newPassword", {
									required: "New password is required",
									minLength: {
										value: 8,
										message: "Password must be at least 8 characters",
									},
								})}
								error={errors?.newPassword?.message}
								type={showPassword ? "text" : "password"}
							/>
							<span
								className={`absolute right-3 ${
									errors.newPassword ? "top-[45%]" : "top-[57%]"
								} transform -translate-y-1/2 cursor-pointer text-gray-500`}
								onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? (
									<MdVisibilityOff size={24} />
								) : (
									<MdVisibility size={24} />
								)}
							</span>
						</div>
						<div className="w-full relative">
							<CustomInput
								label={"Confirm Password"}
								name="confirmPassword"
								register={register("confirmPassword", {
									required: "Confirm password is required",
									validate: (value) =>
										value === getValues().newPassword ||
										"Passwords do not match",
								})}
								error={errors?.confirmPassword?.message}
								type={showPassword2 ? "text" : "password"}
							/>
							<span
								className={`absolute right-3 ${
									errors.confirmPassword ? "top-[45%]" : "top-[57%]"
								} transform -translate-y-1/2 cursor-pointer text-gray-500`}
								onClick={() => setShowPassword2(!showPassword2)}>
								{showPassword2 ? (
									<MdVisibilityOff size={24} />
								) : (
									<MdVisibility size={24} />
								)}
							</span>
						</div>
						<div className="w-full flex flex-row justify-center items-center gap-3 mt-3">
							<CustomButton
								label={"Cancel"}
								bgColor="#DFE6EC"
								bordered
								borderSize="lg"
								textColor="#002855"
								onClick={() => {
									reset();
									navigate("/login");
								}}
							/>
							<CustomButton
								label={"Submit"}
								bgColor="#f2c008"
								bordered
								borderSize="lg"
								textColor="#002855"
								type="submit"
							/>
						</div>
					</form>
				</div>
			</div>
			{isUpdating && <CustomBackdrop open={true} text={"Please wait..."} />}
		</>
	);
}
