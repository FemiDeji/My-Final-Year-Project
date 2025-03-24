/* eslint-disable react/prop-types */

import Stat from "../../components/Stat";
import { LuBook, LuBookCheck, LuBookDown, LuBookX } from "react-icons/lu";
import useUser from "../../hooks/auth/useUser";

export default function Stats({ bookings, numApproved, numDeclined }) {
	const { profile } = useUser();

	const numBookings = bookings?.length;

	return (
		<div className="flex flex-row xs:flex-col w-full justify-between items-center gap-3">
			{profile?.role === "user" && (
				<Stat
					title={"Bookings"}
					icon={<LuBook className="text-2xl xs:text-xl" strokeWidth={1.5} />}
					color={"#002855"}
					value={numBookings}
				/>
			)}
			{profile?.role === "admin" && (
				<Stat
					title={"Requests"}
					icon={
						<LuBookDown className="text-2xl xs:text-xl" strokeWidth={1.5} />
					}
					color={"#002855"}
					value={numBookings}
				/>
			)}
			<Stat
				title={"Approved"}
				icon={<LuBookCheck className="text-2xl xs:text-xl" strokeWidth={1.5} />}
				color={"#002855"}
				value={numApproved}
			/>
			<Stat
				title={"Declined"}
				icon={<LuBookX className="text-2xl xs:text-xl" strokeWidth={1.5} />}
				color={"#002855"}
				value={numDeclined}
			/>
		</div>
	);
}
