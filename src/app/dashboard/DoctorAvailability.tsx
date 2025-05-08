"use client";

import { useEffect, useState } from "react";
import { IDoctorAvailabilitySlot } from "@models/DoctorAvailability";
import { getDoctorSlotsByDoctor } from "@actions/doctorAvailability";
import { Button } from "@src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { useRouter } from "next/navigation";

// Import supporting components
import SlotCreationModal from "@src/components/doctor-availability/SlotCreationModal";
import CalendarView from "@src/components/doctor-availability/CalendarView";
import SlotTemplates from "@src/components/doctor-availability/SlotTemplates";
import BatchSlotManager from "@src/components/doctor-availability/BatchSlotManager";
import QuickActions from "@src/components/doctor-availability/QuickActions";

interface Props {
	doctorId: string;
}

export default function DoctorAvailability({ doctorId }: Props) {
	const [slots, setSlots] = useState<IDoctorAvailabilitySlot[]>([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [activeView, setActiveView] = useState("calendar");
	const router = useRouter();

	// Fetch doctor slots
	const fetchSlots = async () => {
		try {
			setLoading(true);
			const data = await getDoctorSlotsByDoctor(doctorId);
			setSlots(data);
		} catch (error) {
			console.error("Error fetching doctor slots:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSlots();
	}, [doctorId]);

	// Handle opening the slot creation modal
	const handleOpenModal = (date?: Date) => {
		if (date) {
			setSelectedDate(date);
		}
		setIsModalOpen(true);
	};

	// Handle applying a template (selected time slots)
	const handleApplyTemplate = (timeSlots: string[]) => {
		// Open modal with pre-selected time slots
		setIsModalOpen(true);
	};

	// Render loading state
	if (loading && slots.length === 0) {
		return (
			<div className="mb-8 bg-white p-6 rounded-xl shadow border border-blue-50 mx-auto flex justify-center items-center min-h-[200px]">
				<div className="flex items-center gap-2 text-gray-400">
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
					Loading availability slots...
				</div>
			</div>
		);
	}

	return (
		<div className="mb-8 bg-white p-6 rounded-xl shadow border border-blue-50 mx-auto">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
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
					<h3 className="text-xl font-semibold text-blue-700">
						Manage Your Availability
					</h3>
				</div>

				<Button onClick={() => handleOpenModal()} className="whitespace-nowrap">
					Create New Slots
				</Button>
			</div>

			{/* Tabs for different views */}
			<Tabs
				defaultValue="calendar"
				className="w-full"
				onValueChange={setActiveView}
			>
				<TabsList className="grid grid-cols-2 mb-6">
					<TabsTrigger value="calendar">Calendar View</TabsTrigger>
					<TabsTrigger value="management">Slot Management</TabsTrigger>
				</TabsList>

				{/* Calendar View Tab */}
				<TabsContent value="calendar" className="space-y-6">
					<CalendarView
						slots={slots}
						onSlotSelect={handleOpenModal}
						onSlotsChange={fetchSlots}
					/>
				</TabsContent>

				{/* Management View Tab */}
				<TabsContent value="management" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="w-full">
							<QuickActions doctorId={doctorId} onSlotsChange={fetchSlots} />
						</div>
						<div className="w-full">
							<SlotTemplates onApplyTemplate={handleApplyTemplate} />
						</div>
					</div>
					<BatchSlotManager slots={slots} onSlotsChange={fetchSlots} />
				</TabsContent>
			</Tabs>

			{/* Slot Creation Modal */}
			<SlotCreationModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedDate(null);
				}}
				doctorId={doctorId}
				onSuccess={() => {
					fetchSlots();
					router.refresh();
				}}
				defaultDate={selectedDate || undefined}
			/>
		</div>
	);
}
