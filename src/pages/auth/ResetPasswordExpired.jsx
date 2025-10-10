import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton";
import { General_Blue, General_Yellow } from "../../constants/colors";

export default function ResetPasswordExpired() {
	const navigate = useNavigate();

	return (
		<div className="flex items-center justify-center p-12 h-screen xs:p-6 gap-3">
			<div className="p-12 xs:p-6 text-center flex flex-col max-w-5xl xs:max-w-2xl gap-3 justify-center items-center">
				<div className="xs:text-sm text-base text-[#002855] font-medium">
					Your password reset link has expired.
					<br /> Please request a new link to reset your password.
				</div>
				<div className="w-[35%] xs:w-[50%]">
					<CustomButton
						onClick={() => navigate("/login")}
						bgColor={General_Yellow}
						bordered
						borderSize="lg"
						textColor={General_Blue}
						label={"Back to Login"}
					/>
				</div>
			</div>
		</div>
	);
}
