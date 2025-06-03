import supabase from "./supabase";

export async function getHistory() {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		console.error("Error fetching user", userError.message);

		return null;
	}

	const { data: profiles, error: profilesError } = await supabase
		.from("profiles")
		.select("id, role, username")
		.eq("auth_id", user.id)
		.single();

	if (profilesError) {
		console.error("Error fetching profile", profilesError.message);
		return null;
	}

	let statusFilter = ["Declined", "Checked in", "Checked-in Late"];

	if (profiles?.role === "security") {
		statusFilter = ["Checked in", "Checked-in Late"];
	}

	let query = supabase.from("bookings").select("*").in("status", statusFilter);

	if (profiles?.role === "user") {
		query = query.or(
			`user_id.eq.${profiles.id}, username.eq.${profiles.username}`
		);
	}

	const { data: requests, error: requestsError } = await query;

	if (requestsError) {
		console.log("Error fetching requests", requestsError.message);
		throw new Error("Requests could not be fetched");
	}

	return requests;
}

export async function getFilteredHistory({ status, start_date, end_date }) {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		console.error("Error fetching user", userError.message);

		return null;
	}

	const { data: profiles, error: profilesError } = await supabase
		.from("profiles")
		.select("id, role, username")
		.eq("auth_id", user.id)
		.single();

	if (profilesError) {
		console.error("Error fetching profile", profilesError.message);
		return null;
	}

	let statusFilter = ["Declined", "Checked in", "Checked-in Late"];

	if (profiles?.role === "security") {
		statusFilter = ["Checked in", "Checked-in Late"];
	}

	let query = supabase.from("bookings").select("*").in("status", statusFilter);

	if (profiles?.role === "user") {
		query = query.or(
			`user_id.eq.${profiles.id}, username.eq.${profiles.username}`
		);
	}

	if (status && statusFilter.includes(status)) {
		query = query.eq("status", status);
	}

	if (start_date && end_date) {
		query = query.gte("start_date", start_date).lte("end_date", end_date);
	}

	const { data: filteredHistory, error: historyError } = await query;

	if (historyError) {
		console.error("Error fetching filtered history", historyError.message);
		throw new Error("Filtered history could not be fetched");
	}

	return filteredHistory;
}
