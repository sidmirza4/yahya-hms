import connectDB from "./mongodb";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@models/User";

import { type DefaultSession, type NextAuthConfig } from "next-auth";
import { type JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id?: string;
			role?: string;
		} & DefaultSession["user"];
	}

	interface User {
		id?: string;
		email?: string | null;
		name?: string | null;
		role?: string;
	}
}

export const authOptions: NextAuthConfig = {
	pages: {
		signIn: "/login",
		error: "/login",
	},
	providers: [
		credentials({
			name: "Credentials",
			id: "credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				await connectDB();
				const user = await User.findOne({
					email: credentials?.email,
				}).select("+password");
				if (!user) {
					throw new Error("Invalid email");
				}
				const passwordMatch = await bcrypt.compare(
					credentials!.password as string,
					user.password as string
				);
				if (!passwordMatch) {
					throw new Error("Invalid password");
				}

				// Return user without password
				const { password, ...userWithoutPass } = user.toObject();
				return userWithoutPass;
			},
		}),
	],
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id || "";
				token.email = user.email || "";
				token.name = user.name || "";
				token.role = (user as any).role || "";
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (token) {
				session.user.id = token.id?.toString() || "";
				session.user.email = token.email?.toString() || "";
				session.user.name = token.name?.toString() || "";
				session.user.role = ((token as any).role as string) || "";
			}
			return session;
		},
	},
	session: {
		strategy: "jwt" as const,
	},
};
