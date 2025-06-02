/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import CustomLayoutHeader from "./CustomLayoutHeader";
import CustomStatusLabel from "./CustomStatusLabel";
import Header from "./Header";
import SideBar from "./SideBar";
import { useLocation } from "react-router-dom";
import { isGeneralRoute } from "../helpers/Route";
import CustomButton from "./CustomButton";

export default function Layout({
	title,
	subtitle,
	backArrow = false,
	onClick,
	filters,
	divider = false,
	status = "",
	children,
	button = false,
	borderSize,
	bordered,
	bgColor,
	textColor,
	btnChildren,
	btnOnClick,
	label,
	disabled,
}) {
	const [showIconsOnly, setShowIconsOnly] = useState(false);
	const [showSidebarGeneralList, setShowSidebarGeneralList] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const location = useLocation();
	const isGeneralActive = isGeneralRoute.some(
		(path) => location.pathname === path
	);

	useEffect(() => {
		isGeneralActive
			? setShowSidebarGeneralList(true)
			: setShowSidebarGeneralList(false);
	}, [isGeneralActive]);

	const toggleSidebarGeneralList = () => {
		setShowSidebarGeneralList(!showSidebarGeneralList);
	};

	const toggleSideBar = () => {
		setShowIconsOnly(!showIconsOnly);
	};

	return (
		<div className="min-h-screen flex flex-col h-full">
			<Header
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>
			<div className="flex lg:min-h-screen h-full">
				<div
					className={`flex h-full 
						${showIconsOnly ? "lg:w-[7%] xl:w-[5%]" : "lg:w-[22%] xl:w-[18%]"}
					`}>
					<SideBar
						showIconsOnly={showIconsOnly}
						toggleSideBar={toggleSideBar}
						toggleSidebarGeneralList={toggleSidebarGeneralList}
						isGeneralActive={isGeneralActive}
						setShowIconsOnly={setShowIconsOnly}
						showSidebarGeneralList={showSidebarGeneralList}
						setIsSidebarOpen={setIsSidebarOpen}
						isSidebarOpen={isSidebarOpen}
					/>
				</div>
				<div
					className={`flex flex-col right-0 gap-3 bg-[whitesmoke] mt-[3.8rem] xs:mt-[3.5rem] ml-1 ${
						showIconsOnly
							? "lg:w-[93%] xl:w-[94%]"
							: "lg:w-[78%] xl:w-[82%] xs:w-full"
					}`}>
					<div className="flex justify-between items-center pt-8 px-8 xs:px-4 xs:pt-5">
						{title && (
							<div className="flex flex-row justify-between items-center">
								<CustomLayoutHeader
									title={title}
									subtitle={subtitle}
									backArrow={backArrow}
									onClick={onClick}
									filters={filters}
								/>
							</div>
						)}
						{button && (
							<div className="w-[20%] lg:w-[22%] xs:w-[45%] whitespace-nowrap xl:w-[15%]">
								<CustomButton
									disabled={disabled}
									bgColor={bgColor}
									textColor={textColor}
									bordered={bordered}
									borderSize={borderSize}
									label={label}
									onClick={btnOnClick}>
									{btnChildren}
								</CustomButton>
							</div>
						)}
						{status && (
							<div className="flex flex-row gap-2 justify-center items-center">
								<span className="font-semibold">Status:</span>
								<CustomStatusLabel status={status} />
							</div>
						)}
					</div>
					{divider && (
						<div className="h-[0.15rem] w-full bg-[#e3e3e3] max-w-full shadow-lg"></div>
					)}
					<div className="w-full p-8 xs:p-4 flex-grow overflow-y-auto xs:h-[65vh]">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
