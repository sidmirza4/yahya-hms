"use server";

import { IUser, addUser } from "@models/User";
import { IDoctorAvailabilitySlot, addDoctorSlot } from "@models/DoctorAvailability";
import bcrypt from "bcryptjs";
import dbConnect from "@lib/mongodb";

function randomFrom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function seedAdminAndDoctors() {
  await dbConnect();
  
  // 1. Seed admin user
  const adminEmail = "sid@admin.com";
  const hashedPassword = await bcrypt.hash("123456", 10);
  
  const admin: Omit<IUser, "_id" | "createdAt" | "updatedAt"> = {
    name: "Sid Admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  };
  
  try {
    await addUser(admin);
    console.log("Admin user created");
  } catch (error) {
    console.error("Error creating admin user:", error);
    // Continue with other seeds even if admin creation fails (might already exist)
  }

  // 2. Seed 10 doctors
  const specializations = [
    "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", 
    "Radiology", "Oncology", "ENT", "Ophthalmology", "General Medicine"
  ];
  
  const doctorNames = [
    "Dr. Alice Smith", "Dr. Bob Lee", "Dr. Carol White", "Dr. David Kim", 
    "Dr. Eva Green", "Dr. Frank Black", "Dr. Grace Brown", "Dr. Henry Stone", 
    "Dr. Ivy Young", "Dr. Jack Fox"
  ];
  
  const doctors: Array<Omit<IUser, "_id" | "createdAt" | "updatedAt">> = [];
  
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    const doctor: Omit<IUser, "_id" | "createdAt" | "updatedAt"> = {
      name: doctorNames[i],
      email: `doctor${i + 1}@yahya.com`,
      password: hashedPassword,
      role: "doctor",
      specialization: specializations[i],
    };
    doctors.push(doctor);
  }
  
  // Create doctors and collect their IDs for availability slots
  const doctorIds: string[] = [];
  
  for (const doctor of doctors) {
    try {
      const newDoctor = await addUser(doctor);
      if (newDoctor && newDoctor._id) {
        doctorIds.push(newDoctor._id);
      }
    } catch (error) {
      console.error(`Error creating doctor ${doctor.name}:`, error);
      // Continue with other doctors
    }
  }
  
  // 3. Seed varying future availability slots for each doctor
  // Each doctor gets 3 slots on different days/times
  const slotTimes = ["09:00", "10:30", "14:00", "16:00", "18:00"];
  const today = new Date();
  
  const slotDates = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i + 1);
    return d.toISOString().slice(0, 10);
  });
  
  for (let i = 0; i < doctorIds.length; i++) {
    const doctorId = doctorIds[i];
    for (let j = 0; j < 3; j++) {
      const date = slotDates[(i + j) % slotDates.length];
      const time = slotTimes[(i + j) % slotTimes.length];
      
      const slot: Omit<IDoctorAvailabilitySlot, "_id" | "createdAt" | "updatedAt"> = {
        doctorId,
        date,
        time,
      };
      
      try {
        await addDoctorSlot(slot);
      } catch (error) {
        console.error(`Error creating slot for doctor ${doctorId}:`, error);
        // Continue with other slots
      }
    }
  }
  
  return { success: true, message: "Seeded 1 admin and 10 doctors with availability!" };
}
