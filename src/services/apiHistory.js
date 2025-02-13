import supabase from "./supabase";

export async function getHistory(role, userId) {
	let query = supabase
		.from("bookings")
		.select("*")
		.in("status", ["Approved", "Declined"]);

	if (role === "user" && userId) {
		query = query.eq("user_id", userId).in("status", ["Approved", "Declined"]);
	} else {
		query = query.in("status", ["Approved", "Declined"]);
	}

	const { data: requests, error: requestsError } = await query;

	if (requestsError) {
		console.log("Error fetching requests", requestsError.message);
		throw new Error("Requests could not be fetched");
	}

	return requests;
}

export async function getFilteredHistory(
	role,
	userId,
	status,
	start_date,
	end_date
) {
	let query = supabase.from("bookings").select("*");

	if (role === "user" && userId) {
		query = query.eq("user_id", userId);
	}

	if (status) {
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
