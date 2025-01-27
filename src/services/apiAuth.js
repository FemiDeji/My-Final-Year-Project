import supabase, { supabaseUrl } from "./supabase";

export async function signup({
	fullname,
	email,
	password,
	role = "user",
	username,
	phone,
	level,
	department,
	room,
	guardian_name,
}) {
	// Step 1: Sign up the user in the auth table
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: { fullname, username, avatar: "" },
		},
	});

	if (error) throw new Error(error.message);

	const user = data.user;

	// Step 2: Insert data into the profiles table

	if (user) {
		const { error: profileError } = await supabase.from("profiles").insert({
			auth_id: user.id,
			username,
			fullname,
			email,
			phone,
			department,
			level,
			room,
			guardian_name,
			role,
		});

		if (profileError) throw new Error(profileError.message);
	}
	return data;
}

export async function login({ identifier, password }) {
	// Step 1: Check if the identifier is a username or email

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("email", "username")
		.or(`username.eq.${identifier}, email.eq.${identifier}`) // Match username or email
		.single();

	if (profileError) throw new Error(profileError.message);

	// Step 2: Use the email to log in

	const { data, error } = await supabase.auth.signInWithPassword({
		email: profile.email,
		password,
	});

	if (error) throw new Error(error.message);

	return data;
}

export async function getCurrentUser() {
	// Step 1: Get the current user
	const { data: session } = await supabase.auth.getSession();
	if (!session.session) return null;

	// Step 2: Get the current user from the session
	const { data: user, error: userError } = await supabase.auth.getUser();
	if (userError) throw new Error(userError.message);

	// Step 3: Fetch the user role from the profiles table
	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("role")
		.eq("auth_id", user.user.id)
		.single();

	if (profileError) throw new Error(profileError.message);

	// Step 4: Return the user details with the role
	return { ...user.user, role: profile.role };
}

export async function logout() {
	const { error } = await supabase.auth.signOut();
	if (error) throw new Error(error.message);
}

export async function updateCurrentUser({
	fullname,
	password,
	phone_no,
	room_no,
	guardian_name,
	department,
	level,
	avatar,
}) {
	// Step 1: Upload the password OR fullname
	let updateData;
	if (password) updateData = { password };
	if (fullname) updateData = { data: { fullname } };
	if (phone_no) updateData = { phone_no };
	if (room_no) updateData = { room_no };
	if (guardian_name) updateData = { guardian_name };
	if (department) updateData = { department };
	if (level) updateData = { level };

	const { data, error } = await supabase.auth.updateUser(updateData);

	if (error) throw new Error(error.message);
	if (!avatar) return data;

	// Step 2: Upload the avatar image
	const fileName = `avatar-${data.user.id}-${Date.now()}`;

	const { error: storageError } = await supabase.storage
		.from("avatars")
		.upload(fileName, avatar);

	if (storageError) throw new Error(storageError.message);

	// Step 3: Update avatar in the user
	const { data: updatedUser, error: updateUserError } =
		await supabase.auth.updateUser({
			data: {
				avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
			},
		});

	if (updateUserError) throw new Error(updateUserError.message);

	return updatedUser;
}
