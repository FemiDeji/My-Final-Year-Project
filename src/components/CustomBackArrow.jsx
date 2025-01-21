/* eslint-disable react/prop-types */
import { FaArrowLeft } from "react-icons/fa";

export default function CustomBackArrow({ className }) {
	return (
		<div>
			<FaArrowLeft className={className} />
		</div>
	);
}
