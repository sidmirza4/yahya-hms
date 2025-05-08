"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@components/ui/calendar";
import { Button } from "@components/ui/button";
import { IDoctorAvailabilitySlot } from "@models/DoctorAvailability";
import { format, parse, isEqual, isAfter } from "date-fns";
import { deleteDoctorSlot } from "@actions/doctorAvailability";

interface CalendarViewProps {
  slots: IDoctorAvailabilitySlot[];
  onSlotSelect: (date: Date) => void;
  onSlotsChange: () => void;
}

export default function CalendarView({ slots, onSlotSelect, onSlotsChange }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateSlots, setDateSlots] = useState<IDoctorAvailabilitySlot[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Group slots by date for the selected date
  useEffect(() => {
    if (selectedDate) {
      const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd");
      const filteredSlots = slots.filter(slot => slot.date === formattedSelectedDate);
      setDateSlots(filteredSlots);
    } else {
      setDateSlots([]);
    }
  }, [selectedDate, slots]);

  // Function to check if a date has slots
  const hasSlots = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return slots.some(slot => slot.date === formattedDate);
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle slot deletion
  const handleDeleteSlot = async (slotId: string) => {
    try {
      setIsDeleting(true);
      await deleteDoctorSlot(slotId);
      onSlotsChange();
    } catch (error) {
      console.error("Error deleting slot:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Generate dates with slots for highlighting in the calendar
  const datesWithSlots = slots.reduce<Date[]>((dates, slot) => {
    const slotDate = parse(slot.date, "yyyy-MM-dd", new Date());
    if (!dates.some(date => isEqual(date, slotDate))) {
      dates.push(slotDate);
    }
    return dates;
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border shadow p-3"
          modifiers={{
            hasSlot: datesWithSlots,
          }}
          modifiersStyles={{
            hasSlot: {
              backgroundColor: "#EBF5FF",
              color: "#3B82F6",
              fontWeight: "bold",
            },
          }}
          disabled={{ before: new Date() }}
        />
        <div className="mt-4 flex justify-center">
          <Button 
            onClick={() => selectedDate && onSlotSelect(selectedDate)}
            className="w-full"
          >
            Add Slots for {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Selected Date"}
          </Button>
        </div>
      </div>

      <div className="md:w-1/2">
        <div className="bg-white p-4 rounded-md border shadow">
          <h3 className="text-lg font-semibold mb-3">
            Slots for {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Selected Date"}
          </h3>
          
          {dateSlots.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No slots available for this date</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-1">
              {dateSlots.map(slot => (
                <div 
                  key={slot._id} 
                  className="flex justify-between items-center bg-blue-50 rounded-md py-1.5 px-3"
                >
                  <span className="font-medium text-sm">{slot.time}</span>
                  <button 
                    type="button"
                    className="text-gray-600 hover:text-red-600 transition-colors"
                    onClick={() => handleDeleteSlot(slot._id)}
                    disabled={isDeleting}
                    title="Delete slot"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
