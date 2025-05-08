"use server";

import { IAppointment } from "@models/Appointment";
import Appointment from "@models/Appointment";
import dbConnect from "@lib/mongodb";

export async function getAppointmentsByPatient(patientId: string): Promise<IAppointment[]> {
  try {
    await dbConnect();
    const appointments = await Appointment.find({ patientId }).sort({ date: 1 });
    return JSON.parse(JSON.stringify(appointments));
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    return [];
  }
}

export async function getAppointmentsByDoctor(doctorId: string): Promise<IAppointment[]> {
  try {
    await dbConnect();
    const appointments = await Appointment.find({ doctorId }).sort({ date: 1 });
    return JSON.parse(JSON.stringify(appointments));
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return [];
  }
}

export async function getAllAppointments(): Promise<IAppointment[]> {
  try {
    await dbConnect();
    const appointments = await Appointment.find().sort({ date: 1 });
    return JSON.parse(JSON.stringify(appointments));
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    return [];
  }
}

export async function addAppointment(appointment: Omit<IAppointment, "_id" | "createdAt" | "updatedAt">): Promise<IAppointment | null> {
  try {
    await dbConnect();
    const newAppointment = await Appointment.create(appointment);
    return JSON.parse(JSON.stringify(newAppointment));
  } catch (error) {
    console.error("Error adding appointment:", error);
    return null;
  }
}

export async function updateAppointment(appointment: Partial<IAppointment> & { _id: string }): Promise<IAppointment | null> {
  try {
    await dbConnect();
    const { _id, ...updateData } = appointment;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );
    return JSON.parse(JSON.stringify(updatedAppointment));
  } catch (error) {
    console.error("Error updating appointment:", error);
    return null;
  }
}

export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    await dbConnect();
    await Appointment.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return false;
  }
}

export async function checkDoctorAvailability(doctorId: string, date: string, time: string): Promise<boolean> {
  try {
    await dbConnect();
    
    // Create date range for the selected time slot (30 min duration)
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // Add 30 minutes
    
    // Check if there are any existing appointments for this doctor in this time slot
    const existingAppointments = await Appointment.find({
      doctorId,
      date: {
        $gte: startDateTime,
        $lt: endDateTime
      },
      status: { $nin: ['cancelled'] } // Exclude cancelled appointments
    });
    
    // If no appointments found, the slot is available
    return existingAppointments.length === 0;
  } catch (error) {
    console.error("Error checking doctor availability:", error);
    return false;
  }
}

export async function getDoctorAvailableSlots(doctorId: string, date: string): Promise<string[]> {
  try {
    await dbConnect();
    
    // Get all appointments for this doctor on this date
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);
    
    const appointments = await Appointment.find({
      doctorId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $nin: ['cancelled'] }
    });
    
    // Extract the times that are already booked
    const bookedTimes = appointments.map(app => {
      const appDate = new Date(app.date);
      return `${appDate.getHours().toString().padStart(2, '0')}:${appDate.getMinutes().toString().padStart(2, '0')}`;
    });
    
    // Import the time slots from utils
    const { FIXED_TIME_SLOTS } = await import('@src/utils/timeSlots');
    
    // Filter out the booked times
    const availableSlots = FIXED_TIME_SLOTS.filter(slot => !bookedTimes.includes(slot));
    
    return availableSlots;
  } catch (error) {
    console.error("Error getting doctor available slots:", error);
    return [];
  }
}
