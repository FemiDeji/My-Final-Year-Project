/* eslint-disable react/prop-types */
import { Navigate, useNavigate } from "react-router-dom";
import useLogout from "../../hooks/auth/useLogout";
import { useIdleTimer } from "react-idle-timer";
import { useEffect } from "react";
import useUser from "../../hooks/auth/useUser";
import CustomBackdrop from "../../components/CustomBackdrop";

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

export default function ProtectedRoute({ children, authUser = [] }) {
	const navigate = useNavigate();
	const { logout, isLoggingOut } = useLogout();
	const { user, profile } = useUser();

	useIdleTimer({
		timeout: IDLE_TIMEOUT,
		onIdle: logout,

		debounce: 500,
		crossTab: true,
	});

	useEffect(() => {
		if (user === undefined) return;
		if (!user && !profile?.auth_id) {
			navigate("/login");
		}
		return () => {};
	}, [navigate, user, profile?.auth_id, authUser, profile?.role]);

	if (user === undefined)
		return <CustomBackdrop open={true} text={"Please wait..."} />;

	if (!user && !profile?.auth_id) return <Navigate to="/login" replace />;

	if (profile?.role && !authUser.includes(profile?.role)) {
		return <Navigate to="/unauthorized" replace />;
	}

	if (
		authUser.length > 0 &&
		profile?.role &&
		!authUser.includes(profile?.role)
	) {
		return <Navigate to="/unauthorized" replace />;
	}

	if (isLoggingOut)
		return <CustomBackdrop open={true} text={"Please wait..."} />;

	return children;
}
