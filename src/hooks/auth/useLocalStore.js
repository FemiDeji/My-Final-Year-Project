export const USER_LOCAL_STORE_KEY = "fedeji";

export const getUser = () => {
	let data = sessionStorage.getItem(USER_LOCAL_STORE_KEY);

	if (!data) return null;

	try {
		return JSON.parse(data);
	} catch (error) {
		console.error("Error parsing user data", error);
		return null;
	}
};

export const saveUser = (user, profile) => {
	const userData = { user, profile };
	sessionStorage.setItem(USER_LOCAL_STORE_KEY, JSON.stringify(userData));
};

export const removeUser = () => {
	sessionStorage.removeItem(USER_LOCAL_STORE_KEY);
};
