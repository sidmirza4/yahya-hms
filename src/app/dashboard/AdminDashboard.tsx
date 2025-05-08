"use client";

import { useEffect, useState } from "react";
import { IUser } from "@models/User";
import { IAppointment } from "@models/Appointment";
import { getAllUsers, addUser, updateUser, deleteUser } from "@actions/users";
import {
	getAllAppointments,
	updateAppointment,
	deleteAppointment,
} from "@actions/appointments";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@src/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Import our new components
import { DashboardOverview } from "@src/components/dashboard/DashboardOverview";
import { UserManagement } from "@src/components/dashboard/UserManagement";
import { AppointmentManagement } from "@src/components/dashboard/AppointmentManagement";

const emptyForm: Omit<IUser, "_id" | "createdAt" | "updatedAt"> = {
	name: "",
	email: "",
	password: "",
	role: "patient",
	phone: "",
	address: "",
	gender: undefined,
	age: undefined,
	specialization: "",
};

export default function AdminDashboard() {
	const [users, setUsers] = useState<IUser[]>([]);
	const [appointments, setAppointments] = useState<IAppointment[]>([]);
	const [form, setForm] = useState<typeof emptyForm>(emptyForm);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("overview");
	const [searchTerm, setSearchTerm] = useState("");
	const router = useRouter();

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				const [usersData, appointmentsData] = await Promise.all([
					getAllUsers(),
					getAllAppointments(),
				]);
				setUsers(usersData);
				setAppointments(appointmentsData);
			} catch (error) {
				console.error("Error fetching admin dashboard data:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	const handleDeleteUser = async (id: string) => {
		try {
			setActionLoading(true);
			await deleteUser(id);
			const [updatedUsers, updatedAppointments] = await Promise.all([
				getAllUsers(),
				getAllAppointments(),
			]);
			setUsers(updatedUsers);
			setAppointments(
				updatedAppointments.filter(
					(a) => a.patientId !== id && a.doctorId !== id
				)
			);
			toast.success("User deleted successfully");
			router.refresh();
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.error("Failed to delete user");
		} finally {
			setActionLoading(false);
		}
	};

	const handleDeleteAppointment = async (id: string) => {
		try {
			setActionLoading(true);
			await deleteAppointment(id);
			const updatedAppointments = await getAllAppointments();
			setAppointments(updatedAppointments);
			toast.success("Appointment deleted successfully");
			router.refresh();
		} catch (error) {
			console.error("Error deleting appointment:", error);
			toast.error("Failed to delete appointment");
		} finally {
			setActionLoading(false);
		}
	};

	const handleUpdateAppointmentStatus = async (
		id: string,
		status: "confirmed" | "cancelled"
	) => {
		try {
			setActionLoading(true);
			const appt = appointments.find((a) => a._id === id);
			if (!appt) return;

			await updateAppointment({ _id: id, status });
			const updatedAppointments = await getAllAppointments();
			setAppointments(updatedAppointments);
			toast.success(
				`Appointment ${
					status === "confirmed" ? "confirmed" : "cancelled"
				} successfully`
			);
			router.refresh();
		} catch (error) {
			console.error("Error updating appointment status:", error);
			toast.error("Failed to update appointment status");
		} finally {
			setActionLoading(false);
		}
	};

	const handleFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setForm((f) => ({ ...f, [name]: value }));
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setActionLoading(true);

		try {
			if (!form.name || !form.email || !form.password) {
				setError("Name, email, and password are required.");
				setActionLoading(false);
				return;
			}

			if (editingId) {
				// Edit user
				const userToUpdate = users.find((u) => u._id === editingId);
				if (!userToUpdate) {
					setError("User not found.");
					return;
				}

				await updateUser({ _id: editingId, ...form });
				const updatedUsers = await getAllUsers();
				setUsers(updatedUsers);
				setEditingId(null);
				toast.success("User updated successfully");
			} else {
				// Add user
				if (users.some((u) => u.email === form.email)) {
					setError("Email already exists.");
					setActionLoading(false);
					return;
				}

				await addUser(form);
				const updatedUsers = await getAllUsers();
				setUsers(updatedUsers);
				toast.success("User added successfully");
			}

			setForm(emptyForm);
			router.refresh();
		} catch (error) {
			console.error("Error submitting user form:", error);
			setError("An error occurred. Please try again.");
			toast.error("Failed to save user");
		} finally {
			setActionLoading(false);
		}
	};

	const handleEditUser = (id: string) => {
		const user = users.find((u) => u._id === id);
		if (!user) return;
		setEditingId(id);
		setForm({
			name: user.name,
			email: user.email,
			password: user.password || "", // Password might not be returned from the API
			role: user.role,
			phone: user.phone || "",
			address: user.address || "",
			gender: user.gender,
			age: user.age,
			specialization: user.specialization || "",
		});
		setActiveTab("users");
	};

	// Helper to show names instead of IDs
	const getUserName = (id: string) =>
		users.find((u) => u._id === id)?.name || id;

	// Filter users and appointments based on search term
	const filteredUsers = users.filter(
		(user) =>
			user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.role.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const filteredAppointments = appointments.filter((appointment) => {
		const patient = users.find((u) => u._id === appointment.patientId);
		const doctor = users.find((u) => u._id === appointment.doctorId);
		return (
			patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
		);
	});

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-white py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
				<div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-blue-100 p-6 sm:p-10 flex flex-col items-center justify-center">
					<svg
						className="animate-spin h-10 w-10 text-blue-500 mb-4"
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
					<p className="text-blue-800 text-lg">Loading admin dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-[1400px] bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-blue-100 p-4 sm:p-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
				<div className="flex items-center gap-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="34"
						height="34"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
						className="text-blue-500 drop-shadow-md"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3h-8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"
						/>
					</svg>
					<div>
						<h2 className="text-3xl font-extrabold text-blue-800 tracking-tight drop-shadow">
							Admin Dashboard
						</h2>
						<p className="text-blue-600 text-sm">
							Manage users, appointments, and system settings
						</p>
					</div>
				</div>
				<div className="w-full md:w-64">
					<Input
						placeholder="Search users or appointments..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="bg-white/50 border-blue-100"
					/>
				</div>
			</div>

			<Tabs
				defaultValue="overview"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="grid grid-cols-3 mb-8">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="appointments">Appointments</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6">
					<DashboardOverview
						users={users}
						appointments={appointments}
						onTabChange={setActiveTab}
						handleEditUser={handleEditUser}
						handleUpdateAppointmentStatus={handleUpdateAppointmentStatus}
						getUserName={getUserName}
					/>
				</TabsContent>

				{/* Users Tab */}
				<TabsContent value="users" className="space-y-6">
					<UserManagement
						users={users}
						filteredUsers={filteredUsers}
						form={form}
						editingId={editingId}
						error={error}
						actionLoading={actionLoading}
						handleFormChange={handleFormChange}
						handleSelectChange={handleSelectChange}
						handleFormSubmit={handleFormSubmit}
						handleEditUser={handleEditUser}
						handleDeleteUser={handleDeleteUser}
						resetForm={() => {
							setEditingId(null);
							setForm(emptyForm);
						}}
					/>
				</TabsContent>

				{/* Appointments Tab */}
				<TabsContent value="appointments" className="space-y-6">
					<AppointmentManagement
						users={users}
						appointments={appointments}
						filteredAppointments={filteredAppointments}
						actionLoading={actionLoading}
						handleUpdateAppointmentStatus={handleUpdateAppointmentStatus}
						handleDeleteAppointment={handleDeleteAppointment}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
