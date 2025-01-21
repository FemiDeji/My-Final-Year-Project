import { CiCircleMore } from "react-icons/ci";
import { FaXmark } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";

/* eslint-disable react/prop-types */
export default function CustomStatusLabel({ status }) {
	const formattedStatus =
		typeof status === "string" ? status.toLowerCase() : "";

	let backgroundColor;
	let textColor;

	const statusConfig = {
		pending: {
			colorClass: "bg-general-light-grey- text-general-gray",
			icon: <IoEllipsisHorizontalCircle color={"#DFE6EC"} size={18} />,
			label: "Pending",
		},
		declined: {
			colorClass: "bg-general-light-red- text-general-red",
			icon: <FaXmark color="#E46561" size={18} />,
			label: "Declined",
		},
		approved: {
			colorClass: "bg-general-green text-white",
			icon: <IoMdCheckmark color="#ffffff" size={18} />,
			label: "Approved",
		},
		unknown: {
			colorClass: "bg-general-gray text-general-gray",
			icon: <CiCircleMore color="#DFE6EC" size={18} />,
			label: "Unknown",
		},
	};

	// Determine configuration based on the status
	const { colorClass, icon, label } =
		statusConfig[formattedStatus] || statusConfig["unknown"];

	return (
		<div
			className={`flex gap-2 content-center items-center text-center text-[11px] w-[70%] justify-center rounded-full py-1 px-8 font-bold ${colorClass}`}
			style={{ backgroundColor: backgroundColor, color: textColor }}>
			<span>{icon}</span>
			<span>{label}</span>
		</div>
	);
}
