/* eslint-disable react/prop-types */

import Stat from "../../components/Stat";
import { LuBook, LuBookCheck, LuBookDown, LuBookX } from "react-icons/lu";
import useUser from "../../hooks/auth/useUser";

export default function Stats({ bookings, numDays, confirmedBookings }) {
	const { profile } = useUser();

	return (
		<div className="flex flex-row xs:flex-col w-full justify-between items-center gap-3">
			{profile?.role === "user" && (
				<Stat
					title={"Bookings"}
					icon={<LuBook className="text-2xl xs:text-xl" strokeWidth={1.5} />}
					color={"#002855"}
					value={100}
				/>
			)}
			{profile?.role === "admin" && (
				<Stat
					title={"Requests"}
					icon={
						<LuBookDown className="text-2xl xs:text-xl" strokeWidth={1.5} />
					}
					color={"#002855"}
					value={100}
				/>
			)}
			<Stat
				title={"Approved"}
				icon={<LuBookCheck className="text-2xl xs:text-xl" strokeWidth={1.5} />}
				color={"#002855"}
				value={40}
			/>
			<Stat
				title={"Declined"}
				icon={<LuBookX className="text-2xl xs:text-xl" strokeWidth={1.5} />}
				color={"#002855"}
				value={18}
			/>
		</div>
	);
}
