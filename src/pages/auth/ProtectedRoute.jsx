/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import useLogout from "../../hooks/auth/useLogout";
import { useIdleTimer } from "react-idle-timer";

import useUser from "../../hooks/auth/useUser";
import CustomBackdrop from "../../components/CustomBackdrop";
import PageNotFound from "../PageNotFound";
import { useRef, useState } from "react";
import * as userLocalStore from "../../hooks/auth/useLocalStore";
import GeneralModal from "../../components/GeneralModal";
import CustomButton from "../../components/CustomButton";
import { IDLE_TIMEOUT, WARNING_TIME } from "../../constants/texts";

export default function ProtectedRoute({ children, authUser = [] }) {
	const { logout, isLoggingOut } = useLogout();
	const { user, profile } = useUser();
	const [showModal, setShowModal] = useState(false);

	const countdownTimer = useRef(null);

	const handleIsdle = (callBack) => {
		userLocalStore.removeUser();
		sessionStorage.setItem("isIdle", "true");
		callBack();
	};

	const onIdle = () => {
		if (user) {
			setShowModal(true);
			countdownTimer.current = setTimeout(() => {
				handleIsdle(() => {
					logout();
				});
			}, WARNING_TIME);
		}
	};

	const handleStayLoggedIn = () => {
		setShowModal(false);
		clearTimeout(countdownTimer.current);
		idleTimer.reset();
	};

	const { reset, getRemainingTime } = useIdleTimer({
		timeout: IDLE_TIMEOUT,
		onIdle,
		debounce: 500,
		crossTab: true,
	});

	const idleTimer = { reset, getRemainingTime };

	if (isLoggingOut)
		return <CustomBackdrop open={true} text={"Please wait..."} />;

	if (!user) return <Navigate to="/login" replace />;

	const hasAccess =
		authUser === 0 || (profile?.role && authUser.includes(profile?.role));

	return hasAccess ? (
		<>
			{children}
			<GeneralModal isOpen={showModal} height="30vh" classname={"xs:w-full"}>
				<div className="flex flex-col justify-center items-center gap-2 text-[12]x">
					<p className="text-[12px] font-medium">{"You've been inactive"}</p>
					<p className="text-[12px]">You will be logged out in 1 minute.</p>
					<CustomButton
						label={"Stay Logged In"}
						bgColor="#f2c008"
						textColor="white"
						bordered
						type="button"
						borderSize="lg"
						onClick={handleStayLoggedIn}
					/>
				</div>
			</GeneralModal>
		</>
	) : (
		<PageNotFound />
	);
}
