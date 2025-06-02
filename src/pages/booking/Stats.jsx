/* eslint-disable react/prop-types */

import Stat from "../../components/Stat";
import { LuBook, LuBookCheck, LuBookDown, LuBookX } from "react-icons/lu";
import useUser from "../../hooks/auth/useUser";
import { HiOutlineLogin, HiOutlineLogout } from "react-icons/hi";
import { General_Blue } from "../../constants/colors";

export default function Stats({
	bookings,
	numApproved,
	numDeclined,
	numCheckedIn,
	numCheckedOut,
}) {
	const { profile } = useUser();

	const numBookings = bookings?.length;

	return (
		<div className="flex flex-row xs:flex-col w-full justify-between items-center gap-3">
			{(profile?.role === "user" || profile?.role === "super-admin") && (
				<Stat
					title={"Bookings"}
					icon={<LuBook className="text-2xl xs:text-xl" strokeWidth={1.5} />}
					color={General_Blue}
					value={numBookings}
				/>
			)}
			{(profile?.role === "admin" || profile?.role === "super-admin") && (
				<Stat
					title={"Requests"}
					icon={
						<LuBookDown className="text-2xl xs:text-xl" strokeWidth={1.5} />
					}
					color={General_Blue}
					value={numBookings}
				/>
			)}
			{(profile?.role === "user" ||
				profile?.role === "admin" ||
				profile?.role === "super-admin") && (
				<>
					<Stat
						title={"Approved"}
						icon={
							<LuBookCheck className="text-2xl xs:text-xl" strokeWidth={1.5} />
						}
						color={General_Blue}
						value={numApproved}
					/>
					<Stat
						title={"Declined"}
						icon={<LuBookX className="text-2xl xs:text-xl" strokeWidth={1.5} />}
						color={General_Blue}
						value={numDeclined}
					/>
				</>
			)}
			{profile?.role === "security" && (
				<>
					<Stat
						title={"Checked Out"}
						icon={
							<HiOutlineLogout
								className="text-2xl xs:text-xl"
								strokeWidth={1.5}
							/>
						}
						color={General_Blue}
						value={numCheckedOut}
					/>
					<Stat
						title={"Checked In"}
						icon={
							<HiOutlineLogin
								className="text-2xl xs:text-xl"
								strokeWidth={1.5}
							/>
						}
						color={General_Blue}
						value={numCheckedIn}
					/>
				</>
			)}
		</div>
	);
}
