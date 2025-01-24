/* eslint-disable react/prop-types */

import { HiMiniArrowRightOnRectangle } from "react-icons/hi2";
import { IoMenuOutline } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";

export default function Header({ isSidebarOpen, setIsSidebarOpen }) {
	const navigate = useNavigate();

	return (
		<div className="flex justify-between py-2 px-10 xs:px-5 shadow-sm bg-white fixed w-full z-50 ">
			<div className="lg:hidden text-general-blue pl-2 flex justify-center items-center">
				{!isSidebarOpen ? (
					<LiaTimesSolid onClick={() => setIsSidebarOpen(true)} size={27} />
				) : (
					<IoMenuOutline onClick={() => setIsSidebarOpen(false)} size={27} />
				)}
			</div>
			<img
				src="AU_logo.jpg"
				alt="AU logo"
				className="h-[45px] xs:hidden xs:ml-auto"
			/>
			<div className="flex items-center gap-6 cursor-pointer">
				<div className="xs:hidden rounded-full w-10 h-10 border-white border-2 bg-general-yellow"></div>
				<div className="text-general-blue flex flex-row gap-5 justify-center items-center">
					<div className="flex justify-start items-start xs:items-end flex-col">
						<div className="font-medium text-base xs:text-sm">
							Oluwafemi Adeniyi
						</div>
						<div className="text-xs font-normal mb-1">02/1023</div>
					</div>
					<img src="AU_logo.jpg" alt="AU logo" className="h-[45px] lg:hidden" />
				</div>
				<div className="xs:hidden bg-general-blue h-[2.5rem] w-[0.1rem]"></div>

				<div
					className="flex gap-2 items-center xs:hidden text-general-light-red"
					onClick={() => navigate("/login")}>
					<span>
						<HiMiniArrowRightOnRectangle size={20} />
					</span>
					<span>Log Out</span>
				</div>
			</div>
		</div>
	);
}
