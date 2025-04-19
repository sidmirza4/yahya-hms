import { IUser } from './User';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface IAppointment {
  id: string; // UUID
  patientId: string;
  doctorId: string;
  date: string; // ISO string
  status: AppointmentStatus;
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

const APPOINTMENTS_KEY = 'hms_appointments';

// Utility functions for localStorage CRUD
export function getAllAppointments(): IAppointment[] {
  const data = localStorage.getItem(APPOINTMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveAllAppointments(appointments: IAppointment[]): void {
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
}

export function addAppointment(appointment: IAppointment): void {
  const appointments = getAllAppointments();
  appointments.push(appointment);
  saveAllAppointments(appointments);
}

export function updateAppointment(updated: IAppointment): void {
  const appointments = getAllAppointments().map(a => a.id === updated.id ? updated : a);
  saveAllAppointments(appointments);
}

export function deleteAppointment(id: string): void {
  const appointments = getAllAppointments().filter(a => a.id !== id);
  saveAllAppointments(appointments);
}

export function findAppointmentById(id: string): IAppointment | undefined {
  return getAllAppointments().find(a => a.id === id);
}

export function getAppointmentsByDoctor(doctorId: string): IAppointment[] {
  return getAllAppointments().filter(a => a.doctorId === doctorId);
}

export function getAppointmentsByPatient(patientId: string): IAppointment[] {
  return getAllAppointments().filter(a => a.patientId === patientId);
}
