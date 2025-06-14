/* eslint-disable react/prop-types */

import { HiMiniArrowRightOnRectangle } from "react-icons/hi2";
import { IoMenuOutline } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/auth/useLogout";
import CustomBackdrop from "./CustomBackdrop";
import useUser from "../hooks/auth/useUser";
import { useState } from "react";
import { delayAction } from "../helpers/custom";
import UserAvatar from "../pages/auth/UserAvatar";
import { convertToDateTime } from "../helpers/dateAndTime";

export default function Header({ isSidebarOpen, setIsSidebarOpen }) {
	const { logout, isLoggingOut } = useLogout();
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { user } = useUser();

	return (
		<>
			<div className="flex justify-between py-2 px-10 xs:px-5 shadow-sm bg-white fixed w-full z-50 ">
				<div className="lg:hidden text-general-blue pl-2 flex justify-center items-center">
					{!isSidebarOpen ? (
						<LiaTimesSolid onClick={() => setIsSidebarOpen(true)} size={27} />
					) : (
						<IoMenuOutline onClick={() => setIsSidebarOpen(false)} size={27} />
					)}
				</div>
				<img
					src="/AU_logo.jpg"
					alt="AU logo"
					className="h-[45px] xs:hidden xs:ml-auto cursor-pointer"
					onClick={() => navigate("/dashboard")}
				/>
				<div className="flex items-center gap-6 cursor-pointer">
					<div className="xs:hidden">
						<UserAvatar />
					</div>
					<div className="text-general-blue flex flex-row gap-5 justify-center items-center">
						<div className="flex justify-start items-end flex-col">
							<div className="font-medium text-base xs:text-sm">
								{user?.user?.user_metadata?.fullname}
							</div>
							<div className="text-xs font-medium mb-1">
								{user?.user?.user_metadata?.username}
							</div>
						</div>
					</div>
					<div className="xs:hidden bg-general-blue h-[2.5rem] w-[0.1rem]"></div>
					<div className="lg:hidden">
						<UserAvatar />
					</div>
					<div className="flex flex-col gap-0.5 xs:hidden">
						<div className="text-[11px] text-general-blue font-medium">
							{convertToDateTime(user?.user?.last_sign_in_at)}
						</div>
						<div
							className="flex gap-2 items-center xs:hidden text-general-light-red"
							onClick={() => {
								setIsLoading(true);
								delayAction(() => {
									setIsLoading(false);
									logout();
								}, 2000);
							}}>
							<span>
								<HiMiniArrowRightOnRectangle size={20} />
							</span>
							<span>Log Out</span>
						</div>
					</div>
				</div>
			</div>
			{(isLoggingOut || isLoading) && (
				<CustomBackdrop open={true} text={"Logging out..."} />
			)}
		</>
	);
}
