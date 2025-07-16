/* eslint-disable react/prop-types */

import { convertToDateTime } from "../helpers/dateAndTime";

function CustomLabelValue({ label, value }) {
	return (
		<div className="grid [grid-template-columns:1.5fr_2fr] border items-center text-xs w-full xs:overflow-y-auto ">
			<div className="w-full xs:w-full h-full p-2 text-general-blue font-semibold text-left flex items-center bg-general-yellow xs:text-[10px]">
				{label}
			</div>
			<div className="w-full h-full p-2 border-l text-left font-[500] xs:text-[10px] xs:w-full">
				{label === "Start Date" ||
				label === "Start date" ||
				label === "Return Date" ||
				label === "Return date" ||
				label === "Updated At"
					? convertToDateTime(value)
					: value}
			</div>
		</div>
	);
}

export default CustomLabelValue;
