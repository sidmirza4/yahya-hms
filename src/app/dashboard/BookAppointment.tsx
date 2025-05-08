"use client";

import { useEffect, useState } from "react";
import { IAppointment } from "@models/Appointment";
import { IUser } from "@models/User";
import {
	addAppointment,
	getDoctorAvailableSlots,
	checkDoctorAvailability,
} from "@actions/appointments";
import { getUsersByRole } from "@actions/users";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Textarea } from "@src/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Calendar } from "@src/components/ui/calendar";
import { format } from "date-fns";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import { cn } from "@src/lib/utils";
import { toast } from "sonner";

interface Props {
	patientId: string;
	onBooked?: () => void;
}

import { FIXED_TIME_SLOTS, getStartTimeFromRange } from "@src/utils/timeSlots";

export default function BookAppointment({ patientId, onBooked }: Props) {
	const [doctors, setDoctors] = useState<IUser[]>([]);
	const [doctorId, setDoctorId] = useState("");
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [formattedDate, setFormattedDate] = useState("");
	const [time, setTime] = useState("");
	const [notes, setNotes] = useState("");
	const [availableSlots, setAvailableSlots] = useState<string[]>([]);
	const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
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

	// Update formatted date when selected date changes
	useEffect(() => {
		if (selectedDate) {
			const formatted = format(selectedDate, "yyyy-MM-dd");
			setFormattedDate(formatted);

			// Reset time when date changes
			setTime("");
			setAvailableSlots([]);
		}
	}, [selectedDate]);

	// Fetch available slots when doctor and date are selected
	useEffect(() => {
		if (doctorId && formattedDate) {
			fetchAvailableSlots();
		}
	}, [doctorId, formattedDate]);

	// Function to fetch available slots for the selected doctor and date
	const fetchAvailableSlots = async () => {
		if (!doctorId || !formattedDate) return;

		setIsCheckingAvailability(true);
		setError(null);

		try {
			const slots = await getDoctorAvailableSlots(doctorId, formattedDate);
			setAvailableSlots(slots);

			if (slots.length === 0) {
				setError(
					"No available slots for this date. The doctor hasn't set availability or all slots are booked. Please select another date."
				);
			}
		} catch (error) {
			console.error("Error fetching available slots:", error);
			setError("Failed to fetch available slots. Please try again.");
		} finally {
			setIsCheckingAvailability(false);
		}
	};

	const handleBook = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			if (!doctorId || !formattedDate || !time) {
				toast.error("Please select a doctor, date, and time.");
				setLoading(false);
				return;
			}

			// Double-check doctor availability for the selected time slot
			const isAvailable = await checkDoctorAvailability(
				doctorId,
				formattedDate,
				time
			);
			if (!isAvailable) {
				toast.error(
					"This time slot is no longer available. Please select another time."
				);
				setLoading(false);
				// Refresh available slots
				fetchAvailableSlots();
				return;
			}

			// Extract the start time from the time range
			const startTime = getStartTimeFromRange(time);
			const appointmentDate = new Date(`${formattedDate}T${startTime}`);
			if (isNaN(appointmentDate.getTime())) {
				toast.error("Invalid date or time.");
				setLoading(false);
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
				notes: notes.trim() || undefined, // Only include notes if provided
			};

			await addAppointment(newAppointment);
			toast.success("Appointment request sent!");
			setDoctorId("");
			setSelectedDate(undefined);
			setFormattedDate("");
			setTime("");
			setNotes("");
			if (onBooked) onBooked();
			router.refresh();
		} catch (error) {
			console.error("Error booking appointment:", error);
			toast.error("Failed to book appointment. Please try again.");
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
					className="text-slate-500"
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
				className="space-y-6 bg-white p-6 rounded-xl shadow border border-slate-100 mx-auto"
			>
				{/* Doctor Selection */}
				<div className="space-y-2">
					<label className="block font-medium">Select Doctor</label>
					<select
						className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={doctorId}
						onChange={(e) => setDoctorId(e.target.value)}
					>
						<option value="">Select a Doctor</option>
						{doctors.map((doc) => (
							<option key={doc._id} value={doc._id}>
								{doc.name}
								{doc.specialization ? ` (${doc.specialization})` : ""}
							</option>
						))}
					</select>
				</div>

				{/* Date Picker */}
				<div className="space-y-2">
					<label className="block font-medium">Select Date</label>
					<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className={cn(
									"w-full justify-start text-left font-normal",
									!selectedDate && "text-muted-foreground"
								)}
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
									<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								{selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={(date) => {
									setSelectedDate(date);
									setIsCalendarOpen(false);
								}}
								disabled={(date) =>
									date < new Date(new Date().setHours(0, 0, 0, 0))
								}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				</div>

				{/* Time Slot Selection */}
				<div className="space-y-2">
					<label className="block font-medium">Select Time Slot</label>
					{isCheckingAvailability ? (
						<div className="flex items-center justify-center p-4 border rounded-md">
							<svg
								className="animate-spin h-5 w-5 text-slate-500 mr-2"
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
							Checking available slots...
						</div>
					) : doctorId && formattedDate ? (
						<div>
							{availableSlots.length > 0 ? (
								<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
									{availableSlots.map((slot) => (
										<button
											key={slot}
											type="button"
											className={`p-2 border rounded-md text-sm transition-colors ${
												time === slot
													? "bg-slate-600 text-white"
													: "hover:bg-slate-100"
											}`}
											onClick={() => setTime(slot)}
										>
											{slot}
										</button>
									))}
								</div>
							) : (
								<div className="p-3 bg-amber-50 text-amber-700 rounded-md">
									No available slots for this date. Please select another date.
								</div>
							)}
						</div>
					) : (
						<div className="p-3 bg-gray-50 text-gray-500 rounded-md">
							Please select a doctor and date first
						</div>
					)}
				</div>

				{/* Notes Field */}
				<div className="space-y-2">
					<label className="block font-medium">Notes (Optional)</label>
					<Textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Add any notes or specific concerns for your appointment"
						className="min-h-[100px] w-full"
					/>
				</div>

				{/* Notes about appointment status */}
				<div className="p-3 bg-slate-50 text-slate-600 rounded-md text-sm">
					Your appointment request will be reviewed by the doctor. You'll be notified once it's confirmed.
				</div>

				{/* Submit Button */}
				<Button
					type="submit"
					disabled={loading || !doctorId || !formattedDate || !time}
					className="w-full bg-slate-600 hover:bg-slate-700"
				>
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
