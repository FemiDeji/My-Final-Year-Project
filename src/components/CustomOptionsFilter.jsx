/* eslint-disable react/prop-types */
import { FaCheck } from "react-icons/fa6";

export default function CustomOptionsFilter({
	activeType,
	setActiveType,
	options = [
		{ label: "Buy", value: "buy" },
		{ label: "Sell", value: "sell" },
	],
	className = "",
}) {
	return (
		<div
			className={`flex flex-row justify-start items-center w-full ${className}`}>
			{options.map((option, index) => (
				<button
					key={option.value}
					className={`${index === 0 ? "rounded-l-lg" : ""} ${
						index === options.length - 1 ? "rounded-r-lg" : ""
					} flex flex-row justify-center gap-2 items-center p-3 py-1 w-full text-center ${
						activeType === option.value
							? "bg-general-yellow text-white cursor-not-allowed"
							: "bg-general-grey cursor-pointer"
					}`}
					onClick={() => {
						if (activeType !== option.value) {
							setActiveType(option.value);
						}
					}}
					disabled={activeType === option.value}>
					{activeType === option.value && <FaCheck />}
					<span className="text-sm">{option.label}</span>
				</button>
			))}
		</div>
	);
}
