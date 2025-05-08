import { useState, useEffect } from "react";
import { IUser } from "@models/User";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@src/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@src/components/ui/dialog";

interface UserManagementProps {
	users: IUser[];
	filteredUsers: IUser[];
	form: Omit<IUser, "_id" | "createdAt" | "updatedAt">;
	editingId: string | null;
	error: string | null;
	actionLoading: boolean;
	handleFormChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void;
	handleSelectChange: (name: string, value: string) => void;
	handleFormSubmit: (e: React.FormEvent) => void;
	handleEditUser: (id: string) => void;
	handleDeleteUser: (id: string) => void;
	resetForm: () => void;
}

export function UserManagement({
	users,
	filteredUsers,
	form,
	editingId,
	error,
	actionLoading,
	handleFormChange,
	handleSelectChange,
	handleFormSubmit,
	handleEditUser,
	handleDeleteUser,
	resetForm,
}: UserManagementProps) {
	const [open, setOpen] = useState(false);

	// Open the dialog when editing a user
	useEffect(() => {
		if (editingId) {
			setOpen(true);
		}
	}, [editingId]);

	// Close dialog handler
	const handleCloseDialog = () => {
		setOpen(false);
		if (editingId) {
			resetForm();
		}
	};

	return (
		<div className="space-y-6">
			{/* Add User Button */}
			<div className="flex justify-end">
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button
							className="bg-blue-600 hover:bg-blue-700"
							onClick={() => {
								if (editingId) {
									resetForm();
								}
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="mr-2"
							>
								<path d="M12 5v14M5 12h14" />
							</svg>
							Add New User
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>
								{editingId ? "Edit User" : "Add New User"}
							</DialogTitle>
							<DialogDescription>
								{editingId
									? "Update existing user"
									: "Create a new user account"}
							</DialogDescription>
						</DialogHeader>
						<form
							onSubmit={handleFormSubmit}
							className="space-y-4 bg-blue-50 rounded-lg p-4 border border-blue-100"
						>
							<div className="space-y-3">
								<div className="space-y-2">
									<label className="text-sm font-medium">Name</label>
									<Input
										name="name"
										value={form.name}
										onChange={handleFormChange}
										className="bg-white"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Email</label>
									<Input
										name="email"
										value={form.email}
										onChange={handleFormChange}
										type="email"
										className="bg-white"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Password</label>
									<Input
										name="password"
										value={form.password}
										onChange={handleFormChange}
										type="password"
										className="bg-white"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Role</label>
									<Select
										value={form.role}
										onValueChange={(value) => handleSelectChange("role", value)}
									>
										<SelectTrigger className="bg-white">
											<SelectValue placeholder="Select role" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="patient">Patient</SelectItem>
											<SelectItem value="doctor">Doctor</SelectItem>
											<SelectItem value="admin">Admin</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{form.role === "doctor" && (
									<div className="space-y-2">
										<label className="text-sm font-medium">
											Specialization
										</label>
										<Input
											name="specialization"
											value={form.specialization}
											onChange={handleFormChange}
											className="bg-white"
										/>
									</div>
								)}

								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-2">
										<label className="text-sm font-medium">Phone</label>
										<Input
											name="phone"
											value={form.phone}
											onChange={handleFormChange}
											className="bg-white"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium">Age</label>
										<Input
											name="age"
											value={form.age || ""}
											onChange={handleFormChange}
											type="number"
											className="bg-white"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium">Address</label>
									<Input
										name="address"
										value={form.address}
										onChange={handleFormChange}
										className="bg-white"
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium">Gender</label>
									<Select
										value={form.gender || "not_specified"}
										onValueChange={(value) =>
											handleSelectChange("gender", value)
										}
									>
										<SelectTrigger className="bg-white">
											<SelectValue placeholder="Select gender" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="not_specified">Select</SelectItem>
											<SelectItem value="male">Male</SelectItem>
											<SelectItem value="female">Female</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{error && <div className="text-red-500 text-sm">{error}</div>}

							<DialogFooter className="mt-4">
								<Button
									type="submit"
									// className="w-full"
									disabled={actionLoading}
								>
									{actionLoading ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											{editingId ? "Updating..." : "Adding..."}
										</>
									) : editingId ? (
										"Update User"
									) : (
										"Add User"
									)}
								</Button>
								<Button
									type="button"
									variant="secondary"
									onClick={handleCloseDialog}
								>
									Cancel
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Users Table */}
			<Card className="shadow-md hover:shadow-lg transition-shadow">
				<CardHeader>
					<div className="flex justify-between items-center">
						<div>
							<CardTitle className="text-xl">Users</CardTitle>
							<CardDescription>Manage all registered users</CardDescription>
						</div>
						<div className="text-sm text-blue-600 font-medium">
							Total: {filteredUsers.length} users
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="bg-blue-50 text-left">
									<th className="px-4 py-3 border-b border-blue-100 font-semibold">
										Name
									</th>
									<th className="px-4 py-3 border-b border-blue-100 font-semibold">
										Email
									</th>
									<th className="px-4 py-3 border-b border-blue-100 font-semibold">
										Role
									</th>
									<th className="px-4 py-3 border-b border-blue-100 font-semibold">
										Phone
									</th>
									<th className="px-4 py-3 border-b border-blue-100 font-semibold">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className="px-4 py-4 text-center text-gray-500"
										>
											No users found.
										</td>
									</tr>
								) : (
									filteredUsers.map((user) => (
										<tr
											key={user._id}
											className="border-b border-blue-50 hover:bg-blue-50 transition-colors"
										>
											<td className="px-4 py-3 font-medium">{user.name}</td>
											<td className="px-4 py-3">{user.email}</td>
											<td className="px-4 py-3">
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													{user.role}
												</span>
											</td>
											<td className="px-4 py-3">{user.phone || "-"}</td>
											<td className="px-4 py-3">
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleEditUser(user._id)}
														disabled={actionLoading}
													>
														Edit
													</Button>
													<Button
														variant="destructive"
														size="sm"
														onClick={() => handleDeleteUser(user._id)}
														disabled={actionLoading}
													>
														Delete
													</Button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
