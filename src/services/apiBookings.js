import supabase from "./supabase";

export async function createUpdateBooking(newBooking) {
	let status = "Pending";

	const { data, error } = await supabase
		.from("bookings")
		.insert([{ ...newBooking, status }])
		.select()
		.single();

	if (error) {
		console.error("Error", error);
		throw new Error("Booking could not be created");
	}

	return data;
}

export async function getBookings() {
	// Get the currently logged in user
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
		.select("id")
		.eq("auth_id", user.id)
		.single();

	if (profilesError) {
		console.error("Error fetching profile", profilesError.message);
		return null;
	}

	// Ensure a profile exists before proceeding
	if (!profiles || profiles.length === 0) {
		console.error("No profile found for this user.");
		return null;
	}

	const { data: bookings, error: bookingsError } = await supabase
		.from("bookings")
		.select("*")
		.eq("user_id", profiles.id)
		.eq("status", "Pending");

	if (bookingsError) {
		console.error("Error fecthing booking", bookingsError.message);
		throw new Error("Bookings could not be fetched");
	}

	return bookings;
}

export async function getFilteredBookings({
	role,
	userId,
	start_date,
	end_date,
	priority,
}) {
	let query = supabase.from("bookings").select("*").eq("status", "Pending");

	if (role === "user" && userId) {
		query = query.eq("user_id", userId);
	}

	if (start_date && end_date) {
		query = query.gte("start_date", start_date).lte("end_date", end_date);
	}

	if (priority) {
		query = query.eq("priority", priority);
	}

	const { data: filteredBooking, error: bookingError } = await query;

	if (bookingError) {
		console.error("Error fetching filtered bookings", bookingError.message);
	}

	return filteredBooking;
}

export async function getRequests() {
	const { data: requests, error: requestsError } = await supabase
		.from("bookings")
		.select("*")
		.eq("status", "Pending");

	if (requestsError) {
		console.log("Error fetching requests", requestsError.message);
		throw new Error("Requests could not be fetched");
	}

	return requests;
}

export async function updateBooking(updateData, id) {
	if (!id) {
		console.error("Error: Booking ID is undefined or invalid!");
		throw new Error("Invalid booking ID");
	}

	console.log("data: ", { ...updateData });

	const { data: updateBooking, error: updateBookingError } = await supabase
		.from("bookings")
		.update([{ ...updateData }])
		.eq("id", id)
		.select()
		.single();

	if (updateBookingError) {
		console.error("Error updating status: ", updateBookingError.message);
		throw new Error("Booking could not be updated");
	}

	return updateBooking;
}

export async function getRecentBookings() {
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

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
		.select("id, role")
		.eq("auth_id", user.id)
		.single();

	if (profilesError) {
		console.error("Error fetching profile", profilesError.message);
		return null;
	}

	// Ensure a profile exists before proceeding
	if (!profiles || profiles.length === 0) {
		console.error("No profile found for this user.");
		return null;
	}

	let query = supabase
		.from("bookings")
		.select("*")
		.gte("created_at", thirtyDaysAgo.toISOString());

	if (profiles.role === "user") {
		query = query.eq("user_id", profiles.id);
	}

	const { data: recentBookings, error: recentBookingsError } = await query;

	if (recentBookingsError) {
		console.error("Error fetching recent bookings", recentBookingsError);
	}

	return recentBookings;
}
