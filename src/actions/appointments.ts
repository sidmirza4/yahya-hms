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

export async function checkDoctorAvailability(doctorId: string, date: string, timeRange: string): Promise<boolean> {
  try {
    await dbConnect();
    
    // Extract start time from the time range (e.g., "09:00-09:30" -> "09:00")
    const startTime = timeRange.split('-')[0];
    
    // Create date range for the selected time slot
    const startDateTime = new Date(`${date}T${startTime}`);
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
    
    // First, check if the doctor has set any availability slots for this date
    const DoctorAvailability = (await import('@models/DoctorAvailability')).default;
    const doctorAvailability = await DoctorAvailability.find({
      doctorId,
      date: date // Format: YYYY-MM-DD
    });
    
    // If doctor hasn't set any availability for this date, return empty array
    if (doctorAvailability.length === 0) {
      return [];
    }
    
    // Get all the times the doctor has marked as available
    const availableTimes = doctorAvailability.map(slot => slot.time);
    
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
    
    // Import the helper functions from utils
    const { getStartTimeFromRange } = await import('@src/utils/timeSlots');
    
    // Convert available times to time ranges and filter out booked slots
    const availableSlots = availableTimes.map(time => {
      // Convert single time to range (e.g., "09:00" to "09:00-09:30")
      const [hours, minutes] = time.split(':').map(Number);
      const startTime = new Date();
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime.getTime() + 30 * 60000); // Add 30 minutes
      const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
      
      return `${time}-${endTimeStr}`;
    }).filter(slot => {
      const startTime = getStartTimeFromRange(slot);
      return !bookedTimes.includes(startTime);
    });
    
    return availableSlots;
  } catch (error) {
    console.error("Error getting doctor available slots:", error);
    return [];
  }
}
