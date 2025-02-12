/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import useLogout from "../../hooks/auth/useLogout";
import { useIdleTimer } from "react-idle-timer";

import useUser from "../../hooks/auth/useUser";
import CustomBackdrop from "../../components/CustomBackdrop";
import PageNotFound from "../PageNotFound";

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

export default function ProtectedRoute({ children, authUser = [] }) {
	const { logout, isLoggingOut } = useLogout();
	const { user, profile } = useUser();

	useIdleTimer({
		timeout: IDLE_TIMEOUT,
		onIdle: logout,

		debounce: 500,
		crossTab: true,
	});

	if (isLoggingOut)
		return <CustomBackdrop open={true} text={"Please wait..."} />;

	if (!user) return <Navigate to="/login" replace />;

	const hasAccess =
		authUser === 0 || (profile?.role && authUser.includes(profile?.role));

	return hasAccess ? children : <PageNotFound />;
}
