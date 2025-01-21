/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import CustomLayoutHeader from "./CustomLayoutHeader";
import CustomStatusLabel from "./CustomStatusLabel";
import Header from "./Header";
import SideBar from "./SideBar";
import { useLocation } from "react-router-dom";
import { isGeneralRoute } from "../helpers/Route";

export default function Layout({
	title,
	subtitle,
	backArrow = false,
	onClick,
	filters,
	divider = false,
	status = "",
	children,
}) {
	const [showIconsOnly, setShowIconsOnly] = useState(false);
	const [showSidebarGeneralList, setShowSidebarGeneralList] = useState(false);

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
			<Header />
			<div className="flex min-h-screen h-full">
				<div
					className={`flex h-full 
						${
							showIconsOnly
								? "lg:w-[7%] md:w-[6%] xl:w-[5%]"
								: "lg:w-[22%] mg:w-[15%] xl:w-[18%]"
						}
					`}>
					<SideBar
						showIconsOnly={showIconsOnly}
						toggleSideBar={toggleSideBar}
						toggleSidebarGeneralList={toggleSidebarGeneralList}
						isGeneralActive={isGeneralActive}
						setShowIconsOnly={setShowIconsOnly}
						showSidebarGeneralList={showSidebarGeneralList}
					/>
				</div>
				<div
					className={`flex flex-col right-0 gap-3 bg-[whitesmoke] mt-[3.8rem] ml-1 ${
						showIconsOnly ? "lg:w-[93%] xl:w-[95%]" : "lg:w-[78%] xl:w-[82%]"
					}`}>
					{title && (
						<div className="px-8 pt-8 flex flex-row justify-between items-center">
							<CustomLayoutHeader
								title={title}
								subtitle={subtitle}
								backArrow={backArrow}
								onClick={onClick}
								filters={filters}
							/>
						</div>
					)}
					{status && (
						<div className="flex flex-row gap-2 justify-center items-center">
							<span className="font-semibold">Status:</span>
							<CustomStatusLabel status={status} />
						</div>
					)}
					{divider && (
						<div className="h-[0.15rem] w-full bg-[#e3e3e3] max-w-full shadow-lg"></div>
					)}
					<div className="w-full p-8 flex-grow overflow-y-auto">{children}</div>
				</div>
			</div>
		</div>
	);
}