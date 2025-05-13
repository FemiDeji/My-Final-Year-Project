/* eslint-disable react/prop-types */

import { GoHome } from "react-icons/go";
import ArrowLeftIcon from "./ArrowLeftIcon";
import ArrowRightIcon from "./ArrowRightIcon";

import LinkItem from "./LinkItem";

import { MdOutlineHistoryToggleOff } from "react-icons/md";
import {
	HiMiniArrowRightOnRectangle,
	HiOutlineCog6Tooth,
} from "react-icons/hi2";

import useLogout from "../hooks/auth/useLogout";
import CustomBackdrop from "./CustomBackdrop";
import { useEffect, useRef, useState } from "react";
import { delayAction } from "../helpers/custom";
import useUser from "../hooks/auth/useUser";
import { LuBook, LuBookDown } from "react-icons/lu";
import { IoTicketOutline } from "react-icons/io5";

export default function SideBar({
	showIconsOnly,
	setShowIconsOnly,
	isSidebarOpen,
	setIsSidebarOpen,
}) {
	const { logout, isLoggingOut } = useLogout();
	const [isLoading, setIsLoading] = useState(false);
	const { profile } = useUser();
	const sideBarRef = useRef(null);

	useEffect(() => {
		function handleOutsideClick(e) {
			if (
				!isSidebarOpen &&
				sideBarRef.current &&
				!sideBarRef.current.contains(e.target) &&
				window.innerWidth < 769
			) {
				setIsSidebarOpen(true);
			}
		}

		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [isSidebarOpen, setIsSidebarOpen]);

	return (
		<>
			<div
				ref={sideBarRef}
				className={`bg-white text-general-blue p-3.5 h-[80vh] mt-[4.5rem] scrollable fixed xs:flex xs:flex-col xs:min-h-screen xs:mt-[3.5rem] xs:transition-transform xs:duration-300 xs:ease-in-out xs:z-50 ${
					!isSidebarOpen ? "xs:translate-x-0" : "xs:-translate-x-full"
				} ${
					showIconsOnly
						? "lg:w-[7.2%] xl:w-[5%] md:w-[6%]"
						: "xl:w-[15%] lg:w-[22%] xs:w-[60%]"
				}`}>
				<div className="text-center mb-2 lg:hidden flex justify-center">
					<img src="AU_logo.jpg" alt="AU logo" className="h-[40px] lg:hidden" />
				</div>

				<div
					className={`flex justify-center items-center ${
						!showIconsOnly ? "ml-3 xs:ml-1" : ""
					} xs:gap-1 gap-2`}>
					{!showIconsOnly && (
						<div className="text-[0.75rem] font-medium xs:text-[12px]">
							{`PBS ${
								profile?.role === "user"
									? "STUDENT"
									: profile?.role === "admin"
									? "ADMIN"
									: "SECURITY"
							} PORTAL`}
						</div>
					)}
					<div
						className={`flex xs:hidden bg-white ${!showIconsOnly ? "" : ""}`}>
						{!showIconsOnly && (
							<div title="collapse">
								<ArrowLeftIcon
									className={"cursor-pointer text-[1.3em]"}
									onClick={() => setShowIconsOnly(true)}
								/>
							</div>
						)}

						{showIconsOnly && (
							<div title="expand">
								<ArrowRightIcon
									className={"cursor-pointer text-[1.3em]"}
									onClick={() => setShowIconsOnly(false)}
								/>
							</div>
						)}
					</div>
				</div>

				<div
					className={`flex flex-col mt-14 xs:mt-8 gap-2 ${
						!showIconsOnly ? "ml-3 xs:ml-1" : ""
					} `}>
					<LinkItem
						text={"Home"}
						url={"/dashboard"}
						showIconOnly={showIconsOnly}
						setIsSidebarOpen={setIsSidebarOpen}>
						<GoHome />
					</LinkItem>

					{profile?.role === "user" && (
						<LinkItem
							text={"Bookings"}
							url={"/bookings"}
							showIconOnly={showIconsOnly}
							setIsSidebarOpen={setIsSidebarOpen}>
							<LuBook strokeWidth={1.5} />
						</LinkItem>
					)}

					{profile?.role === "user" && (
						<LinkItem
							text={"Pass"}
							url={"/pass"}
							showIconOnly={showIconsOnly}
							setIsSidebarOpen={setIsSidebarOpen}>
							<IoTicketOutline />
						</LinkItem>
					)}

					{(profile?.role === "admin" || profile?.role === "security") && (
						<LinkItem
							text={"Requests"}
							url={"/requests"}
							showIconOnly={showIconsOnly}
							setIsSidebarOpen={setIsSidebarOpen}>
							<LuBookDown strokeWidth={1.5} />
						</LinkItem>
					)}

					<LinkItem
						text={"History"}
						url={"/history"}
						showIconOnly={showIconsOnly}
						setIsSidebarOpen={setIsSidebarOpen}>
						<MdOutlineHistoryToggleOff />
					</LinkItem>

					<LinkItem
						text={"Settings"}
						url={"/settings"}
						showIconOnly={showIconsOnly}
						setIsSidebarOpen={setIsSidebarOpen}>
						<HiOutlineCog6Tooth />
					</LinkItem>
				</div>

				<div
					className="flex gap-2 items-center lg:hidden xs:ml-3 mt-28 text-general-light-red xs:w-full xs:mb-10"
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
