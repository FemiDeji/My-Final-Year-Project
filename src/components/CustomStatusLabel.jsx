import { CgDanger } from "react-icons/cg";
import { FaXmark } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import { MdWarning } from "react-icons/md";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { HiOutlineLogin, HiOutlineLogout } from "react-icons/hi";

/* eslint-disable react/prop-types */
export default function CustomStatusLabel({ status }) {
	const formattedStatus =
		typeof status === "string" ? status.toLowerCase() : "";

	let backgroundColor;
	let textColor;

	const statusConfig = {
		pending: {
			colorClass: "bg-general-mid-grey text-white",
			iconClass: "text-[#36454F]",
			icon: <IoEllipsisHorizontalCircle size={16} />,
			label: "Pending",
		},
		declined: {
			colorClass: "bg-general-red text-white",
			iconClass: "text-white",
			icon: <FaXmark size={16} />,
			label: "Declined",
		},
		approved: {
			colorClass: "bg-general-green ",
			iconClass: "text-white",
			icon: <IoMdCheckmark size={16} />,
			label: "Approved",
		},
		"checked out": {
			colorClass: "bg-[#8E44AD]",
			iconClass: "text-white",
			icon: <HiOutlineLogout size={16} />,
			label: "Checked out",
		},
		"checked in": {
			colorClass: "bg-general-green ",
			iconClass: "text-white",
			icon: <HiOutlineLogin size={16} />,
			label: "Checkedin",
		},
		"late checkin": {
			colorClass: "bg-[#FF0000]",
			iconClass: "text-white",
			icon: <MdWarning size={16} />,
			label: "Late Checkin",
		},
		"checked-in late": {
			colorClass: "bg-[#FF0000]",
			iconClass: "text-white",
			icon: <CgDanger size={16} />,
			label: "Checked-in Late",
		},
		normal: {
			colorClass: "bg-[#2196F3] ",
			iconClass: "text-white",
			icon: <AiOutlineInfoCircle size={16} />,
			label: "Normal",
		},
		mid: {
			colorClass: "bg-[#FC6A21]",
			iconClass: "text-general-grey",
			icon: <MdWarning size={16} />,
			label: "Mid",
		},
		high: {
			colorClass: "bg-[#FF0000]",
			iconClass: "text-white",
			icon: <CgDanger size={16} />,
			label: "High",
		},
		unknown: {
			colorClass: "bg-general-mid-grey ",
			iconClass: "text-[#36454F]",
			icon: <IoEllipsisHorizontalCircle size={16} />,
			label: "Unknown",
		},
	};

	// Determine configuration based on the status
	const { colorClass, iconClass, icon, label } =
		statusConfig[formattedStatus] || statusConfig["unknown"];

	return (
		<div
			className={`flex gap-2 content-center items-center text-center text-[11px] xs:text-[9px] w-[70%] justify-center rounded-full py-1 px-9 font-bold ${colorClass}`}
			style={{ backgroundColor: backgroundColor, color: textColor }}>
			<span className={`${iconClass}`}>{icon}</span>
			<span className={`${iconClass}`}>{label}</span>
		</div>
	);
}
