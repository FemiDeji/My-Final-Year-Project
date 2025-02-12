/* eslint-disable react/prop-types */

import { convertToDateTime } from "../helpers/dateAndTime";

function CustomLabelValue({ label, value }) {
	return (
		<div className="flex border items-center text-xs w-full xs:overflow-y-auto">
			<div className="w-[30%] xs:w-[40%] h-full p-2 text-general-blue font-semibold text-left flex items-center bg-general-yellow xs:text-[10px]">
				{label}
			</div>
			<div className="w-[70%] h-full p-2 border-l text-left flex items-center font-[500] xs:text-[10px] xs:w-[60%]">
				{label === "Start date" || label === "Return date"
					? convertToDateTime(value)
					: value}
			</div>
		</div>
	);
}

export default CustomLabelValue;
