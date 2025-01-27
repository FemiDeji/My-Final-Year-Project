import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export default function useUser() {
	const { isPending, data: user } = useQuery({
		queryKey: ["user"],
		queryFn: getCurrentUser,
	});

	const isStudent = user?.role === "user";
	const isAdmin = user?.role === "admin";
	const isSuperAdmin = user?.role === "super-admin";
	const isAuthenticated =
		user?.role === "user" ||
		user?.role === "admin" ||
		user?.role === "super-admin";

	return { isPending, isStudent, isAdmin, isSuperAdmin, isAuthenticated, user };
}
