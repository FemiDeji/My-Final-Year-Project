/* eslint-disable react/prop-types */

import { GoHome } from "react-icons/go";
import ArrowLeftIcon from "./ArrowLeftIcon";
import ArrowRightIcon from "./ArrowRightIcon";

import LinkItem from "./LinkItem";
import { IoListOutline } from "react-icons/io5";
import { MdOutlineHistoryToggleOff } from "react-icons/md";
import { HiMiniArrowRightOnRectangle } from "react-icons/hi2";

import useLogout from "../hooks/auth/useLogout";
import CustomBackdrop from "./CustomBackdrop";
import { useState } from "react";
import { delayAction } from "../helpers/custom";
import useUser from "../hooks/auth/useUser";

export default function SideBar({
	showIconsOnly,
	setShowIconsOnly,
	isSidebarOpen,
	setIsSidebarOpen,
}) {
	const { logout, isLoggingOut } = useLogout();
	const [isLoading, setIsLoading] = useState(false);
	const { isStudent } = useUser();

	return (
		<>
			<div
				className={`bg-white text-general-blue p-3.5 h-[80vh] mt-[4.5rem] scrollable fixed xs:flex xs:flex-col xs:min-h-screen xs:mt-[3.8rem] xs:transition-transform xs:duration-300 xs:ease-in-out xs:z-50 ${
					!isSidebarOpen ? "xs:translate-x-0" : "xs:-translate-x-full"
				} ${
					showIconsOnly
						? "lg:w-[7%] xl:w-[5%] md:w-[6%]"
						: "xl:w-[15%] lg:w-[22%] xs:w-[60%]"
				}`}>
				<div className={`flex justify-center items-center ml-3 fixed gap-3`}>
					{!showIconsOnly && (
						<div className="text-[0.9rem] font-medium xs:text-sm">
							{`PBMS ${isStudent ? "STUDENT" : "ADMIN"} PORTAL`}
						</div>
					)}
					<div
						className={`flex xs:hidden bg-white ${!showIconsOnly ? "" : ""}`}>
						{!showIconsOnly && (
							<ArrowLeftIcon
								className={"cursor-pointer text-[1.5em]"}
								onClick={() => setShowIconsOnly(true)}
							/>
						)}

						{showIconsOnly && (
							<ArrowRightIcon
								className={"cursor-pointer text-[1.5em]"}
								onClick={() => setShowIconsOnly(false)}
							/>
						)}
					</div>
				</div>

				<div
					className={`flex flex-col mt-14 gap-2 ${
						!showIconsOnly ? "ml-3" : ""
					} `}>
					<LinkItem
						text={"Home"}
						url={"/dashboard"}
						showIconOnly={showIconsOnly}
						setIsSidebarOpen={setIsSidebarOpen}>
						<GoHome />
					</LinkItem>

					<LinkItem
						text={"Bookings"}
						url={"/bookings"}
						showIconOnly={showIconsOnly}
						setIsSidebarOpen={setIsSidebarOpen}>
						<IoListOutline />
					</LinkItem>

					<LinkItem
						text={"History"}
						url={"/history"}
						showIconOnly={showIconsOnly}
						setIsSidebarOpen={setIsSidebarOpen}>
						<MdOutlineHistoryToggleOff />
					</LinkItem>
				</div>

				<div
					className="flex gap-2 items-center lg:hidden xs:ml-3 mt-auto text-general-light-red xs:w-full xs:mb-10"
					onClick={() => {
						setIsLoading(true);
						delayAction(() => {
							setIsLoading(false);
							logout();
						}, 2000);
					}}>
					<span>
						<HiMiniArrowRightOnRectangle size={18} />
					</span>
					<span className="xs:text-sm font-medium">Log Out</span>
				</div>
			</div>
			{(isLoggingOut || isLoading) && (
				<CustomBackdrop open={true} text={"Logging out..."} />
			)}
		</>
	);
}
