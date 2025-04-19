"use client";

import { useEffect, useState } from "react";
import { IDoctorAvailabilitySlot, getDoctorSlotsByDoctor, addDoctorSlot, deleteDoctorSlot } from "@src/models/DoctorAvailability";
import { Button } from "@src/components/ui/button";

interface Props {
  doctorId: string;
}

// Use fixed slots from utils
import { FIXED_TIME_SLOTS } from "@src/utils/timeSlots";

export default function DoctorAvailability({ doctorId }: Props) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<IDoctorAvailabilitySlot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setSlots(getDoctorSlotsByDoctor(doctorId));
  }, [doctorId]);

  const handleAddSlot = () => {
    if (!date || !selectedTime) return;
    addDoctorSlot({
      id: crypto.randomUUID(),
      doctorId,
      date,
      time: selectedTime
    });
    setSlots(getDoctorSlotsByDoctor(doctorId));
    setSelectedTime("");
    setSuccess("Slot added!");
    setTimeout(() => setSuccess(""), 1000);
  };

  const handleDeleteSlot = (slotId: string) => {
    deleteDoctorSlot(slotId);
    setSlots(getDoctorSlotsByDoctor(doctorId));
  };

  // Only allow future dates
  const todayStr = new Date().toISOString().slice(0,10);

  return (
    <div className="mb-8 bg-white p-6 rounded-xl shadow border border-blue-50 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-blue-700">Set Your Availability</h3>
      </div>
      <div className="flex flex-col md:flex-row gap-2 mb-2">
        <input type="date" min={todayStr} value={date} onChange={e => {setDate(e.target.value); setSelectedTime("");}} className="border rounded p-2" />
        {date && (
  <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="border rounded p-2">
    <option value="">Select Time</option>
    {FIXED_TIME_SLOTS.map(t => (
      <option key={t} value={t}>{t}</option>
    ))}
  </select>
)}
        <Button onClick={handleAddSlot} disabled={!date || !selectedTime}>Add Slot</Button>
      </div>
      {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
      <ul className="space-y-2 mt-4">
        {slots.length === 0 && (
          <li className="flex items-center gap-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No slots set.
          </li>
        )}
        {slots.map(slot => (
          <li key={slot.id} className="flex items-center gap-4 bg-blue-50 rounded px-3 py-2">
            <span className="font-mono text-blue-900">{slot.date} {slot.time}</span>
            <Button variant="destructive" size="sm" onClick={() => handleDeleteSlot(slot.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
