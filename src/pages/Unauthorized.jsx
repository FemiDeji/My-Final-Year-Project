import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import CustomBackArrow from "../components/CustomBackArrow";
import Layout from "../components/Layout";

export default function Unauthorized() {
	const navigate = useNavigate();

	return (
		<Layout>
			<div className="flex items-center justify-center p-12 xs:p-6 gap-3">
				<div className="p-12 xs:p-6 text-center flex flex-col max-w-5xl xs:max-w-2xl gap-3 justify-center items-center">
					<div className="xs:text-base text-[#002855] font-medium">
						You are not authorized to access this page.
					</div>
					<div className="w-[35%] xs:w-[50%]">
						<CustomButton
							onClick={() => navigate("/dashboard")}
							bgColor="#f2c008"
							bordered
							borderSize="lg"
							textColor="#002855"
							label={"Go Back"}>
							<CustomBackArrow />
						</CustomButton>
					</div>
				</div>
			</div>
		</Layout>
	);
}
