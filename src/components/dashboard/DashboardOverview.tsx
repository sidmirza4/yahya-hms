import { IUser } from "@models/User";
import { IAppointment } from "@models/Appointment";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";

interface DashboardOverviewProps {
	users: IUser[];
	appointments: IAppointment[];
	onTabChange: (tab: string) => void;
	handleEditUser: (id: string) => void;
	handleUpdateAppointmentStatus: (id: string, status: "confirmed" | "cancelled") => void;
	getUserName: (id: string) => string;
}

export function DashboardOverview({
	users,
	appointments,
	onTabChange,
	handleEditUser,
	handleUpdateAppointmentStatus,
	getUserName,
}: DashboardOverviewProps) {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="shadow-md hover:shadow-lg transition-shadow">
					<CardHeader className="pb-2">
						<CardTitle className="text-2xl">Total Users</CardTitle>
						<CardDescription>All registered users</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-4xl font-bold text-blue-600">
							{users.length}
						</div>
						<div className="text-sm text-muted-foreground mt-2">
							{users.filter((u) => u.role === "patient").length} Patients,{" "}
							{users.filter((u) => u.role === "doctor").length} Doctors
						</div>
					</CardContent>
				</Card>
				<Card className="shadow-md hover:shadow-lg transition-shadow">
					<CardHeader className="pb-2">
						<CardTitle className="text-2xl">Appointments</CardTitle>
						<CardDescription>All scheduled appointments</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-4xl font-bold text-blue-600">
							{appointments.length}
						</div>
						<div className="text-sm text-muted-foreground mt-2">
							{appointments.filter((a) => a.status === "pending").length}{" "}
							Pending,{" "}
							{appointments.filter((a) => a.status === "confirmed").length}{" "}
							Confirmed
						</div>
					</CardContent>
				</Card>
				<Card className="shadow-md hover:shadow-lg transition-shadow">
					<CardHeader className="pb-2">
						<CardTitle className="text-2xl">Quick Actions</CardTitle>
						<CardDescription>Common tasks</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						<Button
							onClick={() => onTabChange("users")}
							variant="outline"
							className="justify-start h-12 text-base"
						>
							Manage Users
						</Button>
						<Button
							onClick={() => onTabChange("appointments")}
							variant="outline"
							className="justify-start h-12 text-base"
						>
							Manage Appointments
						</Button>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="shadow-md hover:shadow-lg transition-shadow">
					<CardHeader>
						<CardTitle className="text-xl">Recent Users</CardTitle>
						<CardDescription>Latest registered users</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{users.slice(0, 5).map((user) => (
								<div
									key={user._id}
									className="flex items-center justify-between py-3 px-2 border-b border-blue-50 hover:bg-blue-50 rounded-md transition-colors"
								>
									<div className="flex-1">
										<div className="font-medium text-lg">{user.name}</div>
										<div className="text-sm text-gray-500">
											{user.email}
										</div>
									</div>
									<div className="flex items-center gap-3">
										<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
											{user.role}
										</span>
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleEditUser(user._id)}
										>
											Edit
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="shadow-md hover:shadow-lg transition-shadow">
					<CardHeader>
						<CardTitle className="text-xl">Recent Appointments</CardTitle>
						<CardDescription>Latest scheduled appointments</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{appointments.slice(0, 5).map((appointment) => {
								// Format date as DD MMM | HH:mm
								const date = new Date(appointment.date);
								const day = date.getDate().toString().padStart(2, "0");
								const month = date.toLocaleString("en-US", {
									month: "short",
								});
								const hours = date.getHours().toString().padStart(2, "0");
								const minutes = date
									.getMinutes()
									.toString()
									.padStart(2, "0");
								const formattedDate = `${day} ${month} | ${hours}:${minutes}`;

								return (
									<div
										key={appointment._id}
										className="flex items-center justify-between py-3 px-2 border-b border-blue-50 hover:bg-blue-50 rounded-md transition-colors"
									>
										<div className="flex-1">
											<div className="font-medium text-lg">
												{getUserName(appointment.patientId)}
											</div>
											<div className="flex gap-2 items-center">
												<div className="text-sm text-gray-500">
													Doctor: {getUserName(appointment.doctorId)}
												</div>
												<div className="text-sm font-medium text-blue-600">
													{formattedDate}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<span
												className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                              ${
																appointment.status === "confirmed"
																	? "bg-green-100 text-green-800"
																	: ""
															}
                              ${
																appointment.status === "pending"
																	? "bg-yellow-100 text-yellow-800"
																	: ""
															}
                              ${
																appointment.status === "cancelled"
																	? "bg-red-100 text-red-800"
																	: ""
															}
                              ${
																appointment.status === "completed"
																	? "bg-blue-100 text-blue-800"
																	: ""
															}
                            `}
											>
												{appointment.status.charAt(0).toUpperCase() +
													appointment.status.slice(1)}
											</span>
											{appointment.status === "pending" && (
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														handleUpdateAppointmentStatus(
															appointment._id,
															"confirmed"
														)
													}
												>
													Approve
												</Button>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
