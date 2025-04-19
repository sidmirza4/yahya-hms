"use client";

import { useEffect, useState } from "react";
import { IAppointment, getAppointmentsByPatient, deleteAppointment } from "@src/models/Appointment";
import { IUser, findUserById } from "@src/models/User";
import { Button } from "@src/components/ui/button";

interface Props {
  userId: string;
}

export default function PatientAppointments({ userId }: Props) {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  useEffect(() => {
    setAppointments(getAppointmentsByPatient(userId));
  }, [userId]);

  const handleCancel = (id: string) => {
    deleteAppointment(id);
    setAppointments(getAppointmentsByPatient(userId));
  };

  if (appointments.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow border border-blue-50 max-w-md mx-auto flex flex-col items-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mb-2 text-blue-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        No upcoming appointments.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-blue-50 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-blue-700">Upcoming Appointments</h3>
      </div>
      <ul className="space-y-3">
        {appointments.map(app => {
          const doctor = findUserById(app.doctorId);
          return (
            <li key={app.id} className="flex flex-col md:flex-row md:items-center md:justify-between bg-blue-50 rounded-lg px-4 py-3 border border-blue-100 shadow-sm hover:shadow transition-all">
              <div>
                <div><span className="font-semibold">Doctor:</span> {doctor ? doctor.name : "Unknown"} {doctor && doctor.specialization && (<span className="text-gray-500">({doctor.specialization})</span>)}</div>
                <div><span className="font-semibold">Date:</span> {new Date(app.date).toLocaleString()}</div>
                <div><span className="font-semibold">Status:</span> {app.status}</div>
                {app.notes && <div><span className="font-semibold">Notes:</span> {app.notes}</div>}
              </div>
              {app.status === "pending" || app.status === "confirmed" ? (
                <Button className="mt-2 md:mt-0" variant="destructive" onClick={() => handleCancel(app.id)}>
                  Cancel
                </Button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
