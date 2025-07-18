import { newDecryptData } from "../helpers/encrypto";
import { VITE_PASSWORD_REDIRECT } from "../helpers/envData";
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
	guardian_phone,
}) {
	// Step 1: Check if user already exist
	const { data: existingUser, error: existingUserError } = await supabase
		.from("profiles")
		.select("id")
		.or(`email.eq.${email}, username.eq.${username}`)
		.single();

	if (existingUser) {
		throw new Error("User with this email or username already exisits");
	}

	if (existingUserError) {
		console.error(existingUserError);
	}

	// Step 2: Sign up the user in the auth table
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: { fullname, username, avatar: "" },
		},
	});

	if (error) throw new Error(error.message);

	const user = data.user;

	// Step 3: Insert data into the profiles table

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
			guardian_phone,
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

export async function login(encryptedData) {
	// Step 1: Check if the identifier is a username or email
	const { identifier, password } = newDecryptData(encryptedData);

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("*")
		.or(`username.eq.${identifier}, email.eq.${identifier}`) // Match username or email
		.single();

	if (profileError) throw new Error(profileError.message);

	// Step 2: Use the email to log in

	const { data: authData, error } = await supabase.auth.signInWithPassword({
		email: profile.email,
		password,
	});

	if (error) throw new Error(error.message);

	return { data: authData, profile };
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

	// Step 4: Return the user details with the role

	return { ...user.user, role: profileData.role, profile: profileData };
}

export async function logout() {
	const { error } = await supabase.auth.signOut();
	if (error) throw new Error(error.message);

	localStorage.removeItem("authToken");
}

export async function updateCurrentUser({
	fullname,
	password,
	phone,
	room,
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

	const userId = data?.user?.id;
	if (!userId) throw new Error("User ID not found!");

	// Step 2: Upload the avatar image
	let avatarUrl = null;
	if (avatar) {
		const fileName = `avatar-${userId}-${Date.now()}`;

		const { error: storageError } = await supabase.storage
			.from("avatars")
			.upload(fileName, avatar);

		if (storageError) throw new Error(storageError.message);
		avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
	}

	// Step 3: Update avatar in the user
	if (avatarUrl) {
		const { error: avatarUpdateError } = await supabase.auth.updateUser({
			data: {
				avatar: avatarUrl,
			},
		});
		if (avatarUpdateError) throw new Error(avatarUpdateError.message);
	}

	//Step 3: Update the profiles table
	const profileUpdateData = {
		...(fullname && { fullname }),
		...(phone && { phone }),
		...(room && { room }),
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

export async function sendPasswordResetEmail(email) {
	const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: VITE_PASSWORD_REDIRECT,
	});

	if (error) {
		console.error("Could not reset", error);
		throw new Error(error.message);
	}

	return data;
}

export async function updatePassword(newPassword) {
	const { data, error } = await supabase.auth.updateUser({
		password: newPassword,
	});

	if (error) {
		console.error("Error updating password", error);
		throw new Error(error.message);
	}

	return data;
}
