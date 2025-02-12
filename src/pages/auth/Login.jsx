import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import GeneralModal from "../../components/GeneralModal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { delayAction } from "../../helpers/custom";
import CustomBackdrop from "../../components/CustomBackdrop";
import useLogin from "../../hooks/auth/useLogin";
import useUser from "../../hooks/auth/useUser";

export default function Login() {
	const navigate = useNavigate();
	const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { isLogginIn, login } = useLogin();
	const { isPending } = useUser();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			identifier: "",
			password: "",
		},
		mode: "onBlur",
	});

	const onSubmit = (data) => {
		login({ ...data }, { onSettled: () => reset({ data: "" }) });
	};

	return (
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
					className="flex flex-col justify-start items-start gap-2 w-[70%] xs:w-[90%]">
					<div className="text-general-blue font-semibold text-xl text-left">
						Welcome
					</div>
					<div className="text-general-blue text-sm font-medium">
						PASS-BOOK MANAGEMENT SYSTEM
					</div>
					<div className="w-full">
						<CustomInput
							label={"Username or Email"}
							name="identifier"
							register={register("identifier", {
								required: "Username or Email is required",
							})}
							placeholder={"e.g. user@gmail.com or 02/1021"}
							error={errors?.identifier?.message}
						/>
					</div>
					<div className="w-full relative">
						<CustomInput
							label={"Password"}
							name="password"
							register={register("password", {
								required: "Password is required",
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
					<div
						className="text-sm text-general-blue font-medium cursor-pointer"
						onClick={() => setForgotPasswordModal(true)}>
						Forgot password
					</div>
					<div className="flex gap-3 justify-center items-center w-full mt-2">
						<CustomButton
							label={"Login"}
							bgColor="#f2c008"
							textColor="#002855"
							bordered
							borderSize="lg"
							type="submit"
							disabled={isLogginIn}
						/>
						<CustomButton
							label={"Sign up"}
							bgColor="#f2c008"
							textColor="#002855"
							bordered
							borderSize="lg"
							disabled={isLogginIn}
							onClick={() => {
								setIsLoading(true);
								delayAction(() => {
									setIsLoading(false);
									navigate("/signup");
								}, 2000);
							}}
						/>
					</div>
				</form>
			</div>
			<GeneralModal
				isOpen={forgotPasswordModal}
				showCloseButton={true}
				onClose={() => setForgotPasswordModal(false)}>
				<form className="text-left flex justify-center items-center flex-col gap-3 py-3">
					<div className="w-full">
						<CustomInput
							label={"Email"}
							name="email"
							register={register(
								"email",
								forgotPasswordModal && {
									required: "Email is required",
									pattern: {
										value: /^[^s@]+@[^s@]+.[^s@]+$/,
										message: "Invalid email format",
									},
								}
							)}
							error={errors?.email?.message}
						/>
					</div>

					<div className="flex justify-end items-end gap-3 ml-auto lg:w-[55%]">
						<CustomButton
							label={"Cancel"}
							bgColor="#E46561"
							bordered
							borderSize="lg"
							textColor="white"
							onClick={() => setForgotPasswordModal(false)}
						/>
						<CustomButton
							label={"Reset"}
							bgColor="#f2c008"
							textColor="#002855"
							bordered
							borderSize="lg"
							type="submit"
						/>
					</div>
				</form>
			</GeneralModal>
			{(isLoading || isLogginIn || isPending) && (
				<CustomBackdrop
					open={true}
					text={isLogginIn ? "Validating..." : "Please wait..."}
				/>
			)}
		</div>
	);
}
