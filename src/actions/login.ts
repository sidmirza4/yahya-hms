"use server";

import User from "@models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@lib/mongodb";

export const login = async (email: string, password: string) => {
	try {
		// Connect to the database
		await dbConnect();

		// Validate inputs
		if (!email || !password) {
			return { success: false, error: "Email and password are required" };
		}

		// Find the user
		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return { success: false, error: "Invalid email address" };
		}

		// Check password
		const passwordMatch = await bcrypt.compare(
			password,
			user.password as string
		);
		if (!passwordMatch) {
			return { success: false, error: "Incorrect password" };
		}

		// Credentials are valid
		return {
			success: true,
			user: JSON.parse(
				JSON.stringify({
					_id: user._id,
					email: user.email,
					name: user.name,
					role: user.role,
				})
			),
		};
	} catch (error: any) {
		console.error("Login validation error:", error);
		return {
			success: false,
			error: "An unexpected error occurred during login",
		};
	}
};
