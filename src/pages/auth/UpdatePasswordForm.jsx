import { useForm } from "react-hook-form";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import CustomBackdrop from "../../components/CustomBackdrop";
import useLogout from "../../hooks/auth/useLogout";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useState } from "react";
import useUpdateUser from "../../hooks/auth/useUpdateUser";

export default function UpdatePasswordForm() {
	const { updateUser, isUpdating } = useUpdateUser();
	const { logout, isLoggingOut } = useLogout();
	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		reset,
	} = useForm({
		defaultValues: { password: "", confirmPassword: "" },
		mode: "onBlur",
	});
	const onSubmit = (data) => {
		updateUser(
			{ ...data },
			{
				onSettled: () => {
					reset({ password: "", confirmPassword: "" });
					logout();
				},
			}
		);
	};

	return (
		<div className="w-full rounded-lg bg-white p-4">
			<div className="font-medium text-general-blue text-xl">
				Update Password
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mt-2 flex flex-col w-full gap-3">
				<div className="flex justify-center items-start xs:flex-col gap-5">
					<div className="w-full relative">
						<CustomInput
							label={"New password (min 8 chars)"}
							name="password"
							register={register("password", {
								required: "Password is required",
								minLength: {
									value: 8,
									message: "Password needs to be a minimum of 8 characters",
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
					<div className="w-full relative">
						<CustomInput
							label={"Confirm password"}
							name="confirmPassword"
							register={register("confirmPassword", {
								required: "Confirm password is required",
								validate: (value) =>
									value === getValues().password || "Passwords do not match",
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
				<div className="ml-auto flex justify-end items-end gap-3 w-[35%] xs:w-[100%] mt-2">
					<CustomButton
						label={"Cancel"}
						bgColor={General_Grey}
						bordered
						borderSize="lg"
						type="reset"
						onClick={() => reset({ password: "", confirmPassword: "" })}
					/>
					<CustomButton
						label={"Update"}
						bgColor={General_Yellow}
						bordered
						borderSize="lg"
						type="submit"
					/>
				</div>
			</form>
			{(isUpdating || isLoggingOut) && (
				<CustomBackdrop open={true} text={"Please wait..."} />
			)}
		</div>
	);
}
