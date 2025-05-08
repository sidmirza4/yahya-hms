import connectDB from "./mongodb";
import credentials from "next-auth/providers/credentials";
import User from "@models/User";
import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthConfig } from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
	providers: [
		credentials({
			name: "Credentials",
			id: "credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					await connectDB();
					
					if (!credentials?.email || !credentials?.password) {
						return null;
					}
					
					// Find user by email
					const user = await User.findOne({
						email: credentials.email,
					}).select("+password");
					
					if (!user) {
						return null;
					}

					// Verify password
					const isValid = await bcrypt.compare(
						credentials.password as string,
						user.password as string
					);

					if (!isValid) {
						return null;
					}

					// Return user without password and properly serialize it
					const { password, ...userWithoutPassword } = user.toObject();
					return JSON.parse(JSON.stringify(userWithoutPassword));
				} catch (error: any) {
					console.error("NextAuth authorize error:", error);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt" as const,
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				// Ensure user is properly serialized
				token.user = JSON.parse(JSON.stringify(user));
			}
			return token;
		},
		async session({ session, token }) {
			// Ensure session user is properly serialized
			session.user = token.user ? JSON.parse(JSON.stringify(token.user)) : null;
			return session;
		},
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	debug: process.env.NODE_ENV === "development",
});
