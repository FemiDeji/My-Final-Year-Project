import supabase, { supabaseUrl } from "./supabase";

// export async function createNotification({
// 	user_id,
// 	role,
// 	title,
// 	message,
// 	booking_id = null,
// }) {
// 	const { error } = await supabase
// 		.from("notifications")
// 		.insert([{ user_id, role, title, message, booking_id, is_read: false }]);

// 	if (error) {
// 		console.error("Failed to create notification:", error.message);
// 	}
// }

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

	const { data: admins, error: adminsError } = await supabase
		.from("profiles")
		.select("*")
		.or("role", ["admin", "super-admin", "security"]);

	if (adminsError) {
		console.error("Failed to fetch admin emails", adminsError.message);
	} else if (admins && admins.length > 0) {
		for (const admin of admins) {
			const { error: emailError } = await supabase.functions.invoke(
				"send-email",
				{
					body: {
						to: admin.email,
						subject: "New Booking Created",
						html: `<p>A new booking has been submitted by <strong>${newBooking.fullname}</strong> with Matric No : <Strong>${newBooking.username}</Strong>.</br>Priority:${newBooking.priority}</p>`,
					},
				}
			);

			if (emailError) {
				console.error(
					`Failed to send email to ${admin.email}`,
					emailError.message
				);
			}

			// await createNotification({
			// 	user_id: admin.id,
			// 	role: admin.role,
			// 	title: "New Booking Created",
			// 	message: `${newBooking.fullname} with ${newBooking.username} submitted a new booking request.`,
			// 	booking_id: data.id,
			// });
		}
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
		.select("id, role, username")
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

	let query = supabase.from("bookings").select("*").eq("status", "Pending");

	// If not super-admin, filter by user_id
	if (profiles?.role !== "super-admin") {
		query = query.or(
			`user_id.eq.${profiles.id}, username.eq.${profiles.username}`
		);
	}

	const { data: bookings, error: bookingsError } = await query;

	if (bookingsError) {
		console.error("Error fecthing booking", bookingsError.message);
		throw new Error("Bookings could not be fetched");
	}

	return bookings;
}

export async function getNotifications() {}

export async function getFilteredBookings({ start_date, end_date, priority }) {
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

	let statusFilter = ["Pending"];

	if (profiles?.role === "security") {
		statusFilter = ["Approved", "Checked out"];
	}

	let query = supabase.from("bookings").select("*").in("status", statusFilter);

	if (profiles?.role === "user") {
		query = query.or(
			`user_id.eq.${profiles.id}, username.eq.${profiles.username}`
		);
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

export async function getRequests(role) {
	let statusFilter = ["Pending", "Late Checkin"];

	if (role === "security") {
		statusFilter = ["Approved"];
	}

	const { data: requests, error: requestsError } = await supabase
		.from("bookings")
		.select("*")
		.in("status", statusFilter);

	if (requestsError) {
		console.log("Error fetching requests", requestsError.message);
		throw new Error("Requests could not be fetched");
	}

	return requests;
}

export async function getPasses() {
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

	let query = supabase.from("bookings").select("*");

	if (profiles.role !== "user") {
		query = query.in("status", ["Checked out"]);
	} else if (profiles.role === "user") {
		query = query.or(
			`and(user_id.eq.${profiles.id},status.in.("Approved","Checked out","Late Checkin")),and(username.eq.${profiles.username},status.in.("Approved","Checked out","Late Checkin"))`
		);
	}

	const { data: passes, error: passesError } = await query;

	if (passesError) {
		console.error("Error fetching passes", passesError.message);
		throw new Error("Passes could not be fetched");
	}

	return passes;
}

export async function getFilteredPasses({ start_date, end_date, priority }) {
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

	let statusFilter = ["Approved", "Checked out"];

	let query = supabase.from("bookings").select("*").in("status", statusFilter);

	if (profiles?.role === "user") {
		query = query.or(
			`user_id.eq.${profiles.id}, username.eq.${profiles.username}`
		);
	}

	if (start_date && end_date) {
		query = query.gte("start_date", start_date).lte("end_date", end_date);
	}

	if (priority) {
		query = query.eq("priority", priority);
	}

	const { data: filteredPasses, error: passesError } = await query;

	if (passesError) {
		console.error("Error fetching filtered passes", passesError.message);
	}

	return filteredPasses;
}

export async function notifyUserOnApproval(bookingId) {
	const { data: booking, error } = await supabase
		.from("bookings")
		.select("id, fullname, username, email, status")
		.eq("id", bookingId)
		.single();

	if (error || !booking) {
		console.error("Error fetching booking for approval", error);
	}

	if (booking.status !== "Approved") return;

	await supabase.functions.invoke("send-email", {
		body: {
			to: booking.email,
			subject: "Booking Approved",
			html: `<p>Hi ${booking.fullname},<br/><br/>Your booking request has been <strong>approved</strong>. You can now proceed to the next stage.</p>`,
		},
	});
}

export async function updateBooking(updateData, id) {
	if (!id) {
		console.error("Error: Booking ID is undefined orr invalid!");
		throw new Error("Invalid booking ID");
	}

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

	// Notify the user is status is 'Approved'
	if (updateData.status === "Approved") {
		try {
			await notifyUserOnApproval(id);
		} catch (err) {
			console.log("Failed to send approval email to user: ", err);
		}
	}

	return updateBooking;
}

export async function checkInUser(updateData, id, imageFile) {
	if (!id) {
		console.error("Error: Booking ID is undefined orr invalid!");
		throw new Error("Invalid booking ID");
	}

	if (imageFile) {
		// Check file size is not more than 2MB
		const maxSize = 2 * 1024 * 1024;
		if (imageFile.size > maxSize) {
			throw new Error("Max image size allowed is 2MB.");
		}

		// Generate unique image file name
		const ext = imageFile.name.split(".").pop();
		const fileName = `${id}_${Date.now()}.${ext}`;

		// Upload to supabase
		const { error: storageError } = await supabase.storage
			.from("evidence")
			.upload(fileName, imageFile);

		if (storageError) {
			console.error("Upload failed", storageError);
			throw new Error("Failed to upload image!!");
		}
		const imageURL = `${supabaseUrl}/storage/v1/object/public/evidence/${fileName}`;
		updateData.image_evidence = imageURL;
	}

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
		.gte("created_at", thirtyDaysAgo.toISOString())
		.gte("updated_at", thirtyDaysAgo.toISOString());

	if (profiles.role === "user") {
		query = query.eq("user_id", profiles.id);
	}

	const { data: recentBookings, error: recentBookingsError } = await query;

	if (recentBookingsError) {
		console.error("Error fetching recent bookings", recentBookingsError);
	}

	return recentBookings;
}
