"use client";

import { useEffect, useState } from "react";
import { IAppointment } from "@models/Appointment";
import { IUser } from "@models/User";
import {
	getAppointmentsByDoctor,
	updateAppointment,
} from "@actions/appointments";
import { findUserById } from "@actions/users";
import { Button } from "@src/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
	doctorId: string;
}

export default function DoctorAppointments({ doctorId }: Props) {
	const [appointments, setAppointments] = useState<IAppointment[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	// Create a map to store patient data by ID
	const [patientsMap, setPatientsMap] = useState<Record<string, IUser>>({});

	useEffect(() => {
		async function fetchAppointments() {
			try {
				setLoading(true);
				const data = await getAppointmentsByDoctor(doctorId);
				setAppointments(data);
			} catch (error) {
				console.error("Error fetching doctor appointments:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchAppointments();
	}, [doctorId]);

	// Fetch all patients for the appointments in one effect
	useEffect(() => {
		const fetchPatients = async () => {
			const patientIds = [...new Set(appointments.map((app) => app.patientId))];
			const patientsData: Record<string, IUser> = {};

			for (const patientId of patientIds) {
				try {
					const patient = await findUserById(patientId);
					if (patient) {
						patientsData[patientId] = patient;
					}
				} catch (error) {
					console.error(`Error fetching patient ${patientId}:`, error);
				}
			}

			setPatientsMap(patientsData);
		};

		if (appointments.length > 0) {
			fetchPatients();
		}
	}, [appointments]);

	const handleAction = async (
		id: string,
		status: "confirmed" | "cancelled"
	) => {
		try {
			const appt = appointments.find((a) => a._id === id);
			if (!appt) return;

			await updateAppointment({ _id: id, status });
			const updatedAppointments = await getAppointmentsByDoctor(doctorId);
			setAppointments(updatedAppointments);
			router.refresh();
		} catch (error) {
			console.error("Error updating appointment status:", error);
		}
	};

	if (loading) {
		return (
			<div className="bg-white p-6 rounded-xl shadow border border-blue-50 mx-auto flex flex-col items-center text-gray-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="animate-spin h-5 w-5 mr-3 text-blue-500"
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
				Loading appointments...
			</div>
		);
	}

	if (appointments.length === 0) {
		return (
			<div className="bg-white p-6 rounded-xl shadow border border-blue-50 mx-auto flex flex-col items-center text-gray-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth="2"
					className="mb-2 text-blue-200"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				No appointment requests.
			</div>
		);
	}

	return (
		<div className="bg-white p-6 rounded-xl shadow border border-blue-50 max-w-5xl mx-auto">
			<div className="flex items-center gap-2 mb-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth="2"
					className="text-blue-500"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<h3 className="text-lg font-semibold text-blue-700">
					Appointment Requests
				</h3>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full border-collapse">
					<thead>
						<tr className="bg-blue-50 text-left">
							<th className="px-4 py-2 border-b border-blue-100 font-semibold">
								Patient
							</th>
							<th className="px-4 py-2 border-b border-blue-100 font-semibold">
								Date & Time
							</th>
							<th className="px-4 py-2 border-b border-blue-100 font-semibold">
								Status
							</th>
							<th className="px-4 py-2 border-b border-blue-100 font-semibold">
								Notes
							</th>
							<th className="px-4 py-2 border-b border-blue-100 font-semibold">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{appointments.map((app) => {
							// Get patient from the map
							const patient = patientsMap[app.patientId] || null;

							// Format date as DD MMM | HH:mm
							const date = new Date(app.date);
							const day = date.getDate().toString().padStart(2, "0");
							const month = date.toLocaleString("en-US", { month: "short" });
							const hours = date.getHours().toString().padStart(2, "0");
							const minutes = date.getMinutes().toString().padStart(2, "0");
							const formattedDate = `${day} ${month} | ${hours}:${minutes}`;

							return (
								<tr
									key={app._id}
									className="border-b border-blue-50 hover:bg-blue-50 transition-colors"
								>
									<td className="px-4 py-3">
										{patient ? patient.name : "Unknown"}
										{patient && (patient.age || patient.gender) && (
											<span className="text-gray-500 text-sm block">
												{patient.age ? `Age: ${patient.age}` : ""}
												{patient.age && patient.gender ? ", " : ""}
												{patient.gender ? `Gender: ${patient.gender}` : ""}
											</span>
										)}
									</td>
									<td className="px-4 py-3">{formattedDate}</td>
									<td className="px-4 py-3">
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                       ${
												app.status === "confirmed"
													? "bg-teal-50 text-teal-700"
													: ""
											}
                       ${
												app.status === "pending"
													? "bg-amber-50 text-amber-700"
													: ""
											}
                       ${
												app.status === "cancelled"
													? "bg-slate-100 text-slate-700"
													: ""
											}
                       ${
												app.status === "completed"
													? "bg-slate-100 text-slate-700"
													: ""
											}
                     `}
										>
											{app.status.charAt(0).toUpperCase() + app.status.slice(1)}
										</span>
									</td>
									<td className="px-4 py-3">{app.notes || "-"}</td>
									<td className="px-4 py-3">
										{app.status === "pending" && (
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													className="bg-slate-600 text-white hover:bg-slate-700"
													onClick={() => handleAction(app._id, "confirmed")}
												>
													Confirm
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="text-slate-600 border-slate-300 hover:bg-slate-100"
													onClick={() => handleAction(app._id, "cancelled")}
												>
													Decline
												</Button>
											</div>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
