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

/* export async function login({ identifier, password }) {
	// Step 1: Log in using Supabase Auth
	const { data: authData, error: authError } =
		await supabase.auth.signInWithPassword({
			email: identifier, // identifier can be email or username
			password,
		});

	if (authError) throw new Error(authError.message);
	const user = authData?.user;
	if (!user) throw new Error("Login failed. No user found.");

	// Step 2: Fetch the user profile using `auth_id`
	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("*")
		.eq("auth_id", user.id) // Using `auth_id` to match the correct profile
		.single(); // Ensure we only fetch one profile

	if (profileError) throw new Error(profileError.message);

	// Return both user and profile
	return { user, profile };
}
 */

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
	const { data: profileData, error: profileError } = await supabase
		.from("profiles")
		.select("*")
		.eq("auth_id", user.user.id)
		.single();

	if (profileError) throw new Error(profileError.message);
	console.log("profile", profileData);
	console.log("user", user);

	// Step 4: Return the user details with the role

	return { ...user.user, role: profileData.role, profile: profileData };
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
	guardian_phone,
	department,
	level,
	avatar,
}) {
	// Step 1: Upload the password OR fullname
	let updateData;
	if (password) updateData = { password };
	if (fullname) updateData = { fullname };

	const { data, error } = await supabase.auth.updateUser(updateData);
	if (error) throw new Error(error.message);
	if (!avatar) return data;

	const userId = data?.user?.id;
	if (!userId) throw new Error("User ID not found!");

	// Step 2: Upload the avatar image
	let avatarUrl = null;
	if (avatar) {
		const fileName = `avatar-${userId}-${Date.now()}`;

		const { data: avatarData, error: storageError } = await supabase.storage
			.from("avatars")
			.upload(fileName, avatar);

		if (storageError) throw new Error(storageError.message);
		avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;

		return avatarData;
	}

	// Step 3: Update avatar in the user
	const { error: avatarUpdateError } = await supabase.auth.updateUser({
		data: {
			avatar: avatarUrl,
		},
	});

	if (avatarUpdateError) throw new Error(avatarUpdateError.message);

	//Step 3: Update the profiles table
	const profileUpdateData = {
		...(fullname && { fullname }),
		...(phone_no && { phone_no }),
		...(room_no && { room_no }),
		...(guardian_name && { guardian_name }),
		...(guardian_phone && { guardian_phone }),
		...(department && { department }),
		...(level && { level }),
		...(avatarUrl && { avatar: avatarUrl }),
	};

	if (Object.keys(profileUpdateData).length > 0) {
		const { error: profileError } = await supabase
			.from("profiles")
			.update(profileUpdateData)
			.eq("auth_id", userId);

		if (profileError) throw new Error(profileError.message);
	}

	return data;
}
