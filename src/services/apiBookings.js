import supabase from "./supabase";

export async function createUpdateBooking(newBooking) {
	let status = "pending";
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
		.eq("auth_id", user.id);

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
		.eq("user_id", profiles[0].id);

	if (bookingsError) {
		console.error("Error fecthing booking", bookingsError.message);
		throw new Error("Bookings could not be fetched");
	}

	return bookings;
}

export async function getRequests() {
	const { data: requests, error: requestsError } = await supabase
		.from("bookings")
		.select("*");

	if (requestsError) {
		console.log("Error fetching requests", requestsError.message);
		throw new Error("Requests could not be fetched");
	}

	return requests;
}

export async function updateBooking(
	bookingId,
	status = "",
	admin_id,
	rejection_reason = "",
	admin_name
) {
	const updateData = { status, admin_id, admin_name, rejection_reason };

	console.log("Updated data", bookingId, { updateData });

	const { data: updateBooking, error: updateBookingError } = await supabase
		.from("bookings")
		.update([{ ...updateData }])
		.eq("id", bookingId)
		.select()
		.single();

	if (updateBookingError) {
		console.error("Error updating status: ", updateBookingError.message);
		throw new Error("Booking could not be updated");
	}

	return updateBooking;
}
