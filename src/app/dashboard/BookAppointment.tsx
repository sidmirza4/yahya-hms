"use client";

import { useEffect, useState } from "react";
import { IAppointment } from "@models/Appointment";
import { IUser } from "@models/User";
import { addAppointment } from "@actions/appointments";
import { getUsersByRole } from "@actions/users";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { useRouter } from "next/navigation";

interface Props {
	patientId: string;
	onBooked?: () => void;
}

import { FIXED_TIME_SLOTS } from "@src/utils/timeSlots";

export default function BookAppointment({ patientId, onBooked }: Props) {
	const [doctors, setDoctors] = useState<IUser[]>([]);
	const [doctorId, setDoctorId] = useState("");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		async function fetchDoctors() {
			try {
				const doctors = await getUsersByRole("doctor");
				setDoctors(doctors);
			} catch (error) {
				console.error("Error fetching doctors:", error);
			}
		}

		fetchDoctors();
	}, []);

	const handleBook = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setLoading(true);

		try {
			if (!doctorId || !date || !time) {
				setError("Please select a doctor, date, and time.");
				return;
			}

			const appointmentDate = new Date(`${date}T${time}`);
			if (isNaN(appointmentDate.getTime())) {
				setError("Invalid date or time.");
				return;
			}

			const newAppointment = {
				patientId,
				doctorId,
				date: appointmentDate.toISOString(),
				status: "pending" as
					| "pending"
					| "confirmed"
					| "cancelled"
					| "completed",
			};

			await addAppointment(newAppointment);
			setSuccess("Appointment request sent!");
			setDoctorId("");
			setDate("");
			setTime("");
			if (onBooked) onBooked();
			router.refresh();
		} catch (error) {
			console.error("Error booking appointment:", error);
			setError("Failed to book appointment. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mt-8">
			<div className="flex items-center gap-2 mb-3">
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
				<h3 className="text-lg font-semibold">Book New Appointment</h3>
			</div>
			<form
				onSubmit={handleBook}
				className="space-y-4 bg-white p-6 rounded-xl shadow border border-blue-50 mx-auto"
			>
				<div>
					<label className="block mb-1 font-medium">Doctor</label>
					<select
						className="w-full border rounded p-2"
						value={doctorId}
						onChange={(e) => setDoctorId(e.target.value)}
					>
						<option value="">Select Doctor</option>
						{doctors.map((doc) => (
							<option key={doc._id} value={doc._id}>
								{doc.name}
								{doc.specialization ? ` (${doc.specialization})` : ""}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="block mb-1 font-medium">Date</label>
					<Input
						type="date"
						value={date}
						min={new Date().toISOString().slice(0, 10)}
						onChange={(e) => setDate(e.target.value)}
					/>
				</div>
				<div>
					<label className="block mb-1 font-medium">Time</label>
					<select
						className="w-full border rounded p-2"
						value={time}
						onChange={(e) => setTime(e.target.value)}
					>
						<option value="">Select Time</option>
						{FIXED_TIME_SLOTS.map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>
				</div>
				{error && <div className="text-red-500 text-sm">{error}</div>}
				{success && <div className="text-green-600 text-sm">{success}</div>}
				<Button type="submit" disabled={loading}>
					{loading ? (
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
							Booking...
						</>
					) : (
						"Book Appointment"
					)}
				</Button>
			</form>
		</div>
	);
}
