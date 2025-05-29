import supabase from "./supabase";

export async function getProfiles(username) {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("username", username)
		.single();

	if (!data) {
		throw new Error("User not found");
	}

	if (error) {
		throw new Error("Failed to fetch user");
	}

	return data;
}
