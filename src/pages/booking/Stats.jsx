/* eslint-disable react/prop-types */

import Stat from "../../components/Stat";
import { LuBook, LuBookCheck, LuBookDown, LuBookX } from "react-icons/lu";
import useUser from "../../hooks/auth/useUser";
import { HiOutlineLogin, HiOutlineLogout } from "react-icons/hi";
import { General_Blue } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomBackdrop from "../../components/CustomBackdrop";
import { delayAction } from "../../helpers/custom";

export default function Stats({
	bookings,
	numApproved,
	numDeclined,
	numCheckedIn,
	numCheckedOut,
}) {
	const { profile } = useUser();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const numBookings = bookings?.length;

	const handleClick = (url) => {
		setIsLoading(true);
		delayAction(() => {
			setIsLoading(false);
			navigate(url);
		}, 2000);
	};

	return (
		<div className="flex flex-row xs:flex-col w-full justify-between items-center gap-3">
			{(profile?.role === "user" || profile?.role === "super-admin") && (
				<Stat
					title={"Bookings"}
					icon={<LuBook className="text-2xl xs:text-xl" strokeWidth={1.5} />}
					color={General_Blue}
					value={numBookings}
					onclick={() => handleClick("/bookings")}
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
					onclick={() => handleClick("/requests")}
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
						onclick={() => handleClick("/passes")}
					/>
					<Stat
						title={"Declined"}
						icon={<LuBookX className="text-2xl xs:text-xl" strokeWidth={1.5} />}
						color={General_Blue}
						value={numDeclined}
						onclick={() => handleClick("/history")}
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
						onclick={() => handleClick("/passes")}
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
						onclick={() => handleClick("/history")}
					/>
				</>
			)}

			{isLoading && <CustomBackdrop open={true} text={"Please wait..."} />}
		</div>
	);
}
