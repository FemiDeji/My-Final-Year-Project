/* eslint-disable react/prop-types */
import { MdOutlineSearchOff } from "react-icons/md";

function CustomNoRecordFound({ text = "No Record Found" }) {
	return (
		<div className="my-5 text-center text-xs flex items-center justify-center gap-2">
			<span>
				<MdOutlineSearchOff className="text-xl" />
			</span>
			<span>{text}</span>
		</div>
	);
}

export default CustomNoRecordFound;
