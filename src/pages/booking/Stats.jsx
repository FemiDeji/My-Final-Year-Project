/* eslint-disable react/prop-types */
import { FaBookOpen, FaCheck, FaRoad } from "react-icons/fa";
import Stat from "../../components/Stat";
import { FaXmark } from "react-icons/fa6";

export default function Stats({ bookings, numDays, confirmedBookings }) {
	return (
		<div className="flex flex-row justify-between items-center">
			<Stat
				title={"Bookings"}
				icon={<FaBookOpen size={25} />}
				color={"#002855"}
				value={8}
			/>
			<Stat
				title={"Approved"}
				icon={<FaCheck size={25} />}
				color={"#002855"}
				value={8}
			/>
			<Stat
				title={"Declined"}
				icon={<FaXmark size={25} />}
				color={"#002855"}
				value={8}
			/>
			<Stat
				title={"Distance"}
				icon={<FaRoad size={25} />}
				color={"#002855"}
				value={8}
			/>
		</div>
	);
}
