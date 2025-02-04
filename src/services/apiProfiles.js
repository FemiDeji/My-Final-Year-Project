import supabase from "./supabase";

export async function getProfiles(username) {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("username", username)
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
