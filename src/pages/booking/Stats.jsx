/* eslint-disable react/prop-types */

import Stat from "../../components/Stat";
import { BsCheck2Circle, BsPass } from "react-icons/bs";
import { LiaTimesCircle } from "react-icons/lia";

export default function Stats({ bookings, numDays, confirmedBookings }) {
	return (
		<div className="flex flex-row xs:flex-col w-full justify-between items-center gap-3">
			<Stat
				title={"Bookings"}
				icon={<BsPass className="text-2xl xs:text-xl" />}
				color={"#002855"}
				value={100}
			/>
			<Stat
				title={"Approved"}
				icon={<BsCheck2Circle className="text-2xl xs:text-xl" />}
				color={"#002855"}
				value={40}
			/>
			<Stat
				title={"Declined"}
				icon={<LiaTimesCircle className="text-2xl xs:text-xl" />}
				color={"#002855"}
				value={18}
			/>
		</div>
	);
}
