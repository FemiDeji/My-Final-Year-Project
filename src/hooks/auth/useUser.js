import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
import * as userLocalStore from "./useLocalStore";

export default function useUser() {
	const storedUser = userLocalStore.getUser();

	const { isPending, data: user } = useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			if (storedUser?.user?.email) {
				return storedUser;
			}

			const fetchedUser = await getCurrentUser();

			if (fetchedUser?.authData?.user?.email) {
				userLocalStore.saveUser(fetchedUser.authData.user, fetchedUser.profile);
			}

			return fetchedUser;
		},
		initialData: storedUser,
		refetchOnMount: true,
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
	});

	const profile = user?.profile || {};

	const isStudent = user?.role === "user";
	const isAdmin = user?.role === "admin";
	const isSuperAdmin = user?.role === "super-admin";
	const isAuthenticated = isStudent || isAdmin || isSuperAdmin;

	return {
		isPending,
		isStudent,
		isAdmin,
		isSuperAdmin,
		isAuthenticated,
		user,
		profile,
	};
}
