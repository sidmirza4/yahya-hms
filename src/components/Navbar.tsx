"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { IUser } from "@models/User";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { data: session, status } = useSession();
	const router = useRouter();

	const user = session?.user as IUser | undefined;

	const handleLogout = async () => {
		await signOut({ redirect: false });
		router.push("/login");
	};

	return (
		<nav className="w-full bg-primary text-white px-4 py-3 flex items-center justify-between shadow relative z-30">
			{/* Logo */}
			<div className="flex items-center gap-2 font-bold text-lg">
				<Link href="/" className="flex items-center gap-2 hover:underline">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
						className="text-blue-200"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M3 21h18M9 10h6M12 7v6"
						/>
					</svg>
					<span className="hidden sm:inline">Yahya Hospital</span>
				</Link>
			</div>

			{/* Hamburger for mobile */}
			<button
				className="sm:hidden ml-auto text-blue-100 hover:text-white focus:outline-none"
				aria-label="Open menu"
				onClick={() => setIsMenuOpen((v) => !v)}
			>
				{isMenuOpen ? (
					<svg
						width="28"
						height="28"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				) : (
					<svg
						width="28"
						height="28"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4 8h16M4 16h16"
						/>
					</svg>
				)}
			</button>

			{/* Desktop menu */}
			<div className="hidden sm:flex gap-4 items-center">
				{user && user.role === "admin" && (
					<Link href="/dashboard" className="hover:underline whitespace-nowrap">
						Admin Dashboard
					</Link>
				)}
				{user && user.role === "doctor" && (
					<Link href="/dashboard" className="hover:underline whitespace-nowrap">
						Doctor Dashboard
					</Link>
				)}
				{user && user.role === "patient" && (
					<Link href="/dashboard" className="hover:underline whitespace-nowrap">
						Patient Dashboard
					</Link>
				)}
				{!user ? (
					<>
						<Link href="/login" className="hover:underline">
							Login
						</Link>
						<Link href="/register" className="hover:underline">
							Register
						</Link>
					</>
				) : null}
				{user && (
					<>
						<Button
							onClick={handleLogout}
							variant="ghost"
							className="px-3 py-1 text-white hover:text-blue-100 hover:bg-blue-800 flex items-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								/>
							</svg>
							Logout
						</Button>
						<div className="ml-3 flex items-center">
							{user.name ? (
								<div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300 text-blue-700 font-bold text-lg shadow-sm select-none">
									{user.name.charAt(0).toUpperCase()}
								</div>
							) : (
								<div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300 text-blue-700">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="22"
										height="22"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"
										/>
									</svg>
								</div>
							)}
						</div>
					</>
				)}
			</div>

			{/* Mobile menu overlay */}
			{isMenuOpen && (
				<div
					className="sm:hidden fixed inset-0 bg-black/40 z-40"
					onClick={() => setIsMenuOpen(false)}
				/>
			)}
			{/* Mobile menu panel */}
			<div
				className={`sm:hidden fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white text-primary shadow-lg z-50 transform transition-transform duration-300 ${
					isMenuOpen ? "translate-x-0" : "translate-x-full"
				}`}
				style={{ minHeight: "100vh" }}
			>
				<div className="flex flex-col h-full py-6 px-6 gap-6">
					<div className="flex justify-between items-center mb-4">
						<span className="font-bold text-lg text-blue-700">
							Yahya Hospital
						</span>
						<button
							aria-label="Close menu"
							onClick={() => setIsMenuOpen(false)}
							className="text-blue-700"
						>
							<svg
								width="28"
								height="28"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
					{user && user.role === "admin" && (
						<Link
							href="/dashboard"
							className="py-2 px-2 rounded hover:bg-blue-50"
							onClick={() => setIsMenuOpen(false)}
						>
							Admin Dashboard
						</Link>
					)}
					{user && user.role === "doctor" && (
						<Link
							href="/dashboard"
							className="py-2 px-2 rounded hover:bg-blue-50"
							onClick={() => setIsMenuOpen(false)}
						>
							Doctor Dashboard
						</Link>
					)}
					{user && user.role === "patient" && (
						<Link
							href="/dashboard"
							className="py-2 px-2 rounded hover:bg-blue-50 whitespace-nowrap"
							onClick={() => setIsMenuOpen(false)}
						>
							Patient Dashboard
						</Link>
					)}
					{!user ? (
						<>
							<Link
								href="/login"
								className="py-2 px-2 rounded hover:bg-blue-50"
								onClick={() => setIsMenuOpen(false)}
							>
								Login
							</Link>
							<Link
								href="/register"
								className="py-2 px-2 rounded hover:bg-blue-50"
								onClick={() => setIsMenuOpen(false)}
							>
								Register
							</Link>
						</>
					) : null}
					{user && (
						<>
							<Button
								onClick={handleLogout}
								variant="ghost"
								className="py-2 px-3 justify-start text-blue-700 hover:text-white hover:bg-blue-700 whitespace-nowrap"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								Logout
							</Button>
							<div className="flex items-center justify-center mt-4">
								{user.name ? (
									<div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300 text-blue-700 font-bold text-xl shadow-sm select-none">
										{user.name.charAt(0).toUpperCase()}
									</div>
								) : (
									<div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300 text-blue-700">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="28"
											height="28"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"
											/>
										</svg>
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
