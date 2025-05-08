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
