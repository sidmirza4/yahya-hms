"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PatientAppointments from "./PatientAppointments";
import BookAppointment from "./BookAppointment";
import AdminDashboard from "./AdminDashboard";
import DoctorAppointments from "./DoctorAppointments";
import DoctorAvailability from "./DoctorAvailability";
import { IUser } from "@models/User";

// Define a serialized user type that ensures _id is a string
interface SerializedUser {
  _id: string;
  name?: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow for other properties
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<SerializedUser | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || !session.user) {
      router.push("/login");
      return;
    }
    
    // Get the user from session
    const sessionUser = session.user as any;
    
    // Create a serialized user with _id as string
    const serializedUser: SerializedUser = {
      ...sessionUser,
      // Ensure _id is a string
      _id: typeof sessionUser._id === 'object' && sessionUser._id !== null
        ? sessionUser._id.toString()
        : String(sessionUser._id)
    };
    
    setUser(serializedUser);
  }, [session, status, router]);

  if (status === "loading" || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M3 21h18M9 10h6M12 7v6" />
            </svg>
            <h1 className="text-3xl font-bold text-blue-700">Yahya Hospital</h1>
          </div>
          <div className="text-lg text-gray-600">Welcome, {user.name || user.email}!</div>
        </div>
        <div className="bg-white rounded shadow p-8">
          {user.role === "admin" ? (
            <AdminDashboard />
          ) : user.role === "doctor" ? (
            <DoctorDashboard user={user} />
          ) : (
            <PatientDashboard user={user} />
          )}
        </div>
      </div>
    </div>
  );
}

function DoctorDashboard({ user }: { user: SerializedUser }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h2 className="text-xl font-semibold">Doctor Dashboard</h2>
      </div>
      <DoctorAvailability doctorId={user._id} />
      <p className="mb-4">You can view and manage your appointment requests below.</p>
      <DoctorAppointments doctorId={user._id} />
      {/* Future: Add patient list and more doctor-specific features here */}
    </div>
  );
}

function PatientDashboard({ user }: { user: SerializedUser }) {
  const [refresh, setRefresh] = useState(0);
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h2 className="text-xl font-semibold">Patient Dashboard</h2>
      </div>
      <p className="mb-4">You can view your appointments and medical records here.</p>
      <PatientAppointments userId={user._id} key={refresh} />
      <BookAppointment patientId={user._id} onBooked={() => setRefresh(r => r + 1)} />
      {/* Future: Add medical records here */}
    </div>
  );
}
