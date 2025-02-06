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
