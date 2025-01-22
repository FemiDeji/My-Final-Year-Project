/* eslint-disable react/prop-types */

import { GoHome } from "react-icons/go";
import ArrowLeftIcon from "./ArrowLeftIcon";
import ArrowRightIcon from "./ArrowRightIcon";

import LinkItem from "./LinkItem";
import { IoListOutline } from "react-icons/io5";
import { MdOutlineHistoryToggleOff } from "react-icons/md";

export default function SideBar({ showIconsOnly, setShowIconsOnly }) {
	return (
		<div
			className={`bg-white text-general-blue p-3.5  h-[80vh] mt-[4.5rem] scrollable fixed ${
				showIconsOnly
					? "lg:w-[7%] xl:w-[5%] md:w-[6%]"
					: "xl:w-[15%] lg:w-[22%]"
			}`}>
			<div className={`flex justify-center items-center ml-3 fixed gap-3`}>
				{!showIconsOnly && (
					<div className="text-[0.9rem] font-medium">PBMS STUDENT PORTAL</div>
				)}
				<div className={`flex bg-white ${!showIconsOnly ? "" : ""}`}>
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
				<LinkItem text={"Home"} url={"/dashboard"} showIconOnly={showIconsOnly}>
					<GoHome />
				</LinkItem>

				<LinkItem
					text={"Bookings"}
					url={"/bookings"}
					showIconOnly={showIconsOnly}>
					<IoListOutline />
				</LinkItem>

				<LinkItem
					text={"History"}
					url={"/history"}
					showIconOnly={showIconsOnly}>
					<MdOutlineHistoryToggleOff />
				</LinkItem>
			</div>
		</div>
	);
}
