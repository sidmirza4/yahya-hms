"use server";

import { IDoctorAvailabilitySlot } from "@models/DoctorAvailability";
import DoctorAvailability from "@models/DoctorAvailability";
import dbConnect from "@lib/mongodb";

export async function getDoctorSlotsByDoctor(doctorId: string): Promise<IDoctorAvailabilitySlot[]> {
  try {
    await dbConnect();
    const slots = await DoctorAvailability.find({ doctorId }).sort({ date: 1, time: 1 });
    return JSON.parse(JSON.stringify(slots));
  } catch (error) {
    console.error("Error fetching doctor slots:", error);
    return [];
  }
}

export async function getAllDoctorSlots(): Promise<IDoctorAvailabilitySlot[]> {
  try {
    await dbConnect();
    const slots = await DoctorAvailability.find().sort({ date: 1, time: 1 });
    return JSON.parse(JSON.stringify(slots));
  } catch (error) {
    console.error("Error fetching all doctor slots:", error);
    return [];
  }
}

export async function addDoctorSlot(slot: Omit<IDoctorAvailabilitySlot, "_id" | "createdAt" | "updatedAt">): Promise<IDoctorAvailabilitySlot | null> {
  try {
    await dbConnect();
    const newSlot = await DoctorAvailability.create(slot);
    return JSON.parse(JSON.stringify(newSlot));
  } catch (error) {
    console.error("Error adding doctor slot:", error);
    return null;
  }
}

export async function deleteDoctorSlot(id: string): Promise<boolean> {
  try {
    await dbConnect();
    await DoctorAvailability.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error("Error deleting doctor slot:", error);
    return false;
  }
}
