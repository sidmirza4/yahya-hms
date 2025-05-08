import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@src/components/Navbar";
import { Toaster } from "@src/components/ui/sonner";
import Provider from "@src/app/provider";
import { Session } from "next-auth";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Yahya Hospital",
	description:
		"A comprehensive system for managing patients, doctors, and appointments",
	keywords: [
		"hospital",
		"healthcare",
		"appointments",
		"doctors",
		"patients",
		"medical",
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Provider>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<Toaster
						position="top-center"
						expand={true}
						theme={"system"}
						richColors={true}
					/>
					<Navbar />
					{children}
				</body>
			</Provider>
		</html>
	);
}
