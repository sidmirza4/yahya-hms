// Yahya Hospital Data Seeder
// Run this in the browser console or import and run from a Next.js page/component for localStorage seeding

import { addUser, IUser, getAllUsers, saveAllUsers } from "@src/models/User";
import { addDoctorSlot, IDoctorAvailabilitySlot, getAllDoctorSlots, getDoctorSlotsByDoctor } from "@src/models/DoctorAvailability";

function randomFrom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function seedAdminAndDoctors() {
  // 1. Seed admin user
  const adminEmail = "sid@admin.com";
  const admin: IUser = {
    id: crypto.randomUUID(),
    name: "Sid Admin",
    email: adminEmail,
    password: "123456",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // Remove existing admin if present
  let users = getAllUsers().filter(u => u.email !== adminEmail);
  users.push(admin);
  saveAllUsers(users);

  // 2. Seed 10 doctors
  const specializations = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "Radiology", "Oncology", "ENT", "Ophthalmology", "General Medicine"];
  const doctorNames = [
    "Dr. Alice Smith", "Dr. Bob Lee", "Dr. Carol White", "Dr. David Kim", "Dr. Eva Green", "Dr. Frank Black", "Dr. Grace Brown", "Dr. Henry Stone", "Dr. Ivy Young", "Dr. Jack Fox"
  ];
  const today = new Date();
  const doctors: IUser[] = [];
  for (let i = 0; i < 10; i++) {
    const d: IUser = {
      id: crypto.randomUUID(),
      name: doctorNames[i],
      email: `doctor${i + 1}@yahya.com`,
      password: "123456",
      role: "doctor",
      specialization: specializations[i],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    doctors.push(d);
  }
  // Remove existing seeded doctors by email
  users = getAllUsers().filter(u => !u.email.startsWith("doctor"));
  saveAllUsers([...users, ...doctors]);

  // 3. Seed varying future availability slots for each doctor
  // Each doctor gets 3 slots on different days/times
  const slotTimes = ["09:00", "10:30", "14:00", "16:00", "18:00"];
  const slotDates = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i + 1);
    return d.toISOString().slice(0, 10);
  });
  // Clear all existing slots
  localStorage.setItem("doctor_availability", "[]");
  for (let i = 0; i < doctors.length; i++) {
    const doctor = doctors[i];
    for (let j = 0; j < 3; j++) {
      const date = slotDates[(i + j) % slotDates.length];
      const time = slotTimes[(i + j) % slotTimes.length];
      const slot: IDoctorAvailabilitySlot = {
        id: crypto.randomUUID(),
        doctorId: doctor.id,
        date,
        time,
      };
      addDoctorSlot(slot);
    }
  }
  alert("Seeded 1 admin and 10 doctors with availability!");
}

// To run: import and call seedAdminAndDoctors() in a Next.js page or use in browser console
