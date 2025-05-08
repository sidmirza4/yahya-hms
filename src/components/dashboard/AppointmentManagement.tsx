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

interface AppointmentManagementProps {
	users: IUser[];
	appointments: IAppointment[];
	filteredAppointments: IAppointment[];
	actionLoading: boolean;
	handleUpdateAppointmentStatus: (id: string, status: "confirmed" | "cancelled") => void;
	handleDeleteAppointment: (id: string) => void;
}

export function AppointmentManagement({
	users,
	appointments,
	filteredAppointments,
	actionLoading,
	handleUpdateAppointmentStatus,
	handleDeleteAppointment,
}: AppointmentManagementProps) {
	return (
		<div className="grid grid-cols-1 gap-6">
			<Card className="shadow-md hover:shadow-lg transition-shadow">
				<CardHeader>
					<div className="flex justify-between items-center">
						<div>
							<CardTitle className="text-xl">Appointments</CardTitle>
							<CardDescription>
								Manage all scheduled appointments
							</CardDescription>
						</div>
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-yellow-400"></div>
								<span className="text-sm">
									{
										appointments.filter((a) => a.status === "pending")
											.length
									}{" "}
									Pending
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-green-400"></div>
								<span className="text-sm">
									{
										appointments.filter((a) => a.status === "confirmed")
											.length
									}{" "}
									Confirmed
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-red-400"></div>
								<span className="text-sm">
									{
										appointments.filter((a) => a.status === "cancelled")
											.length
									}{" "}
									Cancelled
								</span>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="bg-blue-50 text-left">
									<th className="px-4 py-3 border-b border-blue-100 font-semibold">
										Patient
									</th>
									<th className="px-4 py-3 border-b border-blue-100 font-semibold">
										Doctor
									</th>
									<th className="px-4 py-3 border-b border-blue-100 font-semibold">
										Date
									</th>
									<th className="px-4 py-3 border-b border-blue-100 font-semibold">
										Time
									</th>
									<th className="px-4 py-3 border-b border-blue-100 font-semibold">
										Status
									</th>
									<th className="px-4 py-3 border-b border-blue-100 font-semibold">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredAppointments.length === 0 ? (
									<tr>
										<td
											colSpan={6}
											className="px-4 py-4 text-center text-gray-500"
										>
											No appointments found.
										</td>
									</tr>
								) : (
									filteredAppointments.map((appointment) => {
										// Format date as DD MMM YYYY
										const date = new Date(appointment.date);
										const day = date
											.getDate()
											.toString()
											.padStart(2, "0");
										const month = date.toLocaleString("en-US", {
											month: "short",
										});
										const year = date.getFullYear();
										const hours = date
											.getHours()
											.toString()
											.padStart(2, "0");
										const minutes = date
											.getMinutes()
											.toString()
											.padStart(2, "0");
										const formattedDate = `${day} ${month} ${year}`;
										const formattedTime = `${hours}:${minutes}`;

										const patient = users.find(
											(u) => u._id === appointment.patientId
										);
										const doctor = users.find(
											(u) => u._id === appointment.doctorId
										);

										return (
											<tr
												key={appointment._id}
												className="border-b border-blue-50 hover:bg-blue-50 transition-colors"
											>
												<td className="px-4 py-3 font-medium">
													<div>{patient?.name || "Unknown"}</div>
													{patient?.phone && (
														<div className="text-xs text-gray-500">
															{patient.phone}
														</div>
													)}
												</td>
												<td className="px-4 py-3">
													<div>{doctor?.name || "Unknown"}</div>
													{doctor?.specialization && (
														<div className="text-xs text-gray-500">
															{doctor.specialization}
														</div>
													)}
												</td>
												<td className="px-4 py-3">{formattedDate}</td>
												<td className="px-4 py-3 font-medium text-blue-600">
													{formattedTime}
												</td>
												<td className="px-4 py-3">
													<span
														className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                    ${appointment.status === "confirmed" ? "bg-teal-50 text-teal-700" : ""}
                                    ${appointment.status === "pending" ? "bg-amber-50 text-amber-700" : ""}
                                    ${appointment.status === "cancelled" ? "bg-slate-100 text-slate-700" : ""}
                                    ${appointment.status === "completed" ? "bg-slate-100 text-slate-700" : ""}
                                  `}
													>
														{appointment.status.charAt(0).toUpperCase() +
															appointment.status.slice(1)}
													</span>
												</td>
												<td className="px-4 py-3">
													<div className="flex gap-2">
														{appointment.status === "pending" && (
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	handleUpdateAppointmentStatus(
																		appointment._id,
																		"confirmed"
																	)
																}
																disabled={actionLoading}
															>
																Approve
															</Button>
														)}
														{appointment.status !== "cancelled" && (
															<Button
																variant="outline"
																size="sm"
																className="text-slate-600 border-slate-300 hover:bg-slate-100"
																onClick={() =>
																	handleUpdateAppointmentStatus(
																		appointment._id,
																		"cancelled"
																	)
																}
																disabled={actionLoading}
															>
																Cancel
															</Button>
														)}
														<Button
															variant="outline"
															size="sm"
															className="text-slate-600 border-slate-300 hover:bg-slate-100"
															onClick={() =>
																handleDeleteAppointment(appointment._id)
															}
															disabled={actionLoading}
														>
															Delete
														</Button>
													</div>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
