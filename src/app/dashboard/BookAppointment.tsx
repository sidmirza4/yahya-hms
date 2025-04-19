"use client";

import { useEffect, useState } from "react";
import { IAppointment, addAppointment } from "@src/models/Appointment";
import { IUser, getAllUsers } from "@src/models/User";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { v4 as uuidv4 } from "uuid";

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

  useEffect(() => {
    setDoctors(getAllUsers().filter(u => u.role === "doctor"));
  }, []);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!doctorId || !date || !time) {
      setError("Please select a doctor, date, and time.");
      return;
    }
    const appointmentDate = new Date(`${date}T${time}`);
    if (isNaN(appointmentDate.getTime())) {
      setError("Invalid date or time.");
      return;
    }
    const newAppointment: IAppointment = {
      id: uuidv4(),
      patientId,
      doctorId,
      date: appointmentDate.toISOString(),
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addAppointment(newAppointment);
    setSuccess("Appointment request sent!");
    setDoctorId("");
    setDate("");
    setTime("");
    if (onBooked) onBooked();
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-semibold">Book New Appointment</h3>
      </div>
      <form onSubmit={handleBook} className="space-y-4 bg-white p-6 rounded-xl shadow border border-blue-50 max-w-md mx-auto">
        <div>
          <label className="block mb-1 font-medium">Doctor</label>
          <select
            className="w-full border rounded p-2"
            value={doctorId}
            onChange={e => setDoctorId(e.target.value)}
          >
            <option value="">Select Doctor</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.name}{doc.specialization ? ` (${doc.specialization})` : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <Input type="date" value={date} min={new Date().toISOString().slice(0,10)} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Time</label>
          <select
  className="w-full border rounded p-2"
  value={time}
  onChange={e => setTime(e.target.value)}
>
  <option value="">Select Time</option>
  {FIXED_TIME_SLOTS.map(t => (
    <option key={t} value={t}>{t}</option>
  ))}
</select>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <Button type="submit">Book Appointment</Button>
      </form>
    </div>
  );
}
