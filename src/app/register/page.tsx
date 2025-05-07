"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import { Input } from "@src/components/ui/input";
import { Button } from "@src/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import { register } from "@src/actions/register";

const registerSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	role: z.enum(["patient", "doctor"], {
		required_error: "Please select a role",
	}),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: "patient",
		},
	});

	const onSubmit = async (values: RegisterFormValues) => {
		try {
			setIsLoading(true);

			const result = await register(values);

			if (result.error) {
				toast.error(result.error as string);
				setIsLoading(false);
				return;
			}

			// Registration successful
			toast.success("Account created successfully!");

			// Add a small delay before redirect to show the success toast
			setTimeout(() => {
				router.push("/login");
			}, 2000);
		} catch (error) {
			const errorMessage = "An error occurred. Please try again.";
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
					<p className="mt-2 text-gray-600">Create a new account</p>
				</div>

				<Card className="bg-white/80 backdrop-blur-xl shadow-xl border-blue-100 relative z-10">
					<CardHeader>
						<CardTitle className="text-center">Register</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Full Name</FormLabel>
											<FormControl>
												<Input placeholder="Enter your full name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

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
													placeholder="Create a password"
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>I am a</FormLabel>
											<div className="flex gap-4">
												<Button
													type="button"
													variant={
														field.value === "patient" ? "default" : "outline"
													}
													className="flex-1"
													onClick={() => form.setValue("role", "patient")}
												>
													Patient
												</Button>
												<Button
													type="button"
													variant={
														field.value === "doctor" ? "default" : "outline"
													}
													className="flex-1"
													onClick={() => form.setValue("role", "doctor")}
												>
													Doctor
												</Button>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Creating account..." : "Create account"}
								</Button>

								<div className="text-center mt-4 text-sm">
									<p>
										Already have an account?{" "}
										<Link
											href="/login"
											className="text-primary hover:underline"
										>
											Sign in
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
