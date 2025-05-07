"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: LoginFormValues) => {
		try {
			setIsLoading(true);

			const res = await signIn("credentials", {
				email: values.email,
				password: values.password,
				redirect: false,
				callbackUrl: "/dashboard",
			});

			if (!res?.ok || res?.error) {
				const errorMessage = res?.error || "Invalid credentials";
				toast.error(errorMessage);
				setIsLoading(false);
				return;
			}

			toast.success("Logged in successfully!");
			setIsLoading(false);

			// Wait for the toast to show before redirecting
			setTimeout(() => {
				router.push(res?.url || "/dashboard");
				router.refresh(); // Refresh the page to update the session
			}, 1000);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "An error occurred. Please try again.";
			toast.error(errorMessage);
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 via-blue-200 to-white relative overflow-hidden">
			{/* Animated glass shapes */}
			<div
				className="absolute top-0 left-1/3 w-72 h-72 max-w-full max-h-full bg-white/20 rounded-full blur-3xl animate-pulse z-0"
				style={{ animationDuration: "7s" }}
			/>
			<div
				className="absolute bottom-0 right-0 w-64 h-64 max-w-full max-h-full bg-blue-300/30 rounded-full blur-2xl animate-pulse z-0"
				style={{ animationDuration: "8s" }}
			/>
			<div
				className="absolute top-1/2 left-1/4 w-40 h-40 max-w-full max-h-full bg-blue-200/30 rounded-full blur-2xl animate-pulse z-0"
				style={{ animationDuration: "6s" }}
			/>
			<div className="w-full max-w-md">
				<div className="text-center mb-8 relative z-10">
					<div className="flex items-center justify-center gap-2 mb-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							className="text-blue-500"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M3 21h18M9 10h6M12 7v6"
							/>
						</svg>
						<h1 className="text-3xl font-bold text-blue-700">Yahya Hospital</h1>
					</div>
					<p className="mt-2 text-gray-600">Sign in to your account</p>
				</div>

				<Card className="bg-white/80 backdrop-blur-xl shadow-xl border-blue-100 relative z-10">
					<CardHeader>
						<CardTitle className="text-center">Login</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your email"
													type="email"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your password"
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Signing in..." : "Sign in"}
								</Button>

								<div className="text-center mt-4 text-sm">
									<p>
										Don&apos;t have an account?{" "}
										<Link
											href="/register"
											className="text-primary hover:underline"
										>
											Register
										</Link>
									</p>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
