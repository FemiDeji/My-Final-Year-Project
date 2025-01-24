/* eslint-disable react/prop-types */
import { FaBookOpen, FaCheck, FaRoad } from "react-icons/fa";
import Stat from "../../components/Stat";
import { FaXmark } from "react-icons/fa6";

export default function Stats({ bookings, numDays, confirmedBookings }) {
	return (
		<div className="flex flex-row xs:flex-col w-full justify-between items-center gap-3">
			<Stat
				title={"Bookings"}
				icon={<FaBookOpen className="text-2xl xs:text-xl" />}
				color={"#002855"}
				value={100}
			/>
			<Stat
				title={"Approved"}
				icon={<FaCheck className="text-2xl xs:text-xl" />}
				color={"#002855"}
				value={40}
			/>
			<Stat
				title={"Declined"}
				icon={<FaXmark className="text-2xl xs:text-xl" />}
				color={"#002855"}
				value={18}
			/>
		</div>
	);
}
