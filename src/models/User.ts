export type UserRole = 'admin' | 'doctor' | 'patient';
export type Gender = 'male' | 'female' | 'other';

export interface IUser {
  id: string; // UUID
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: string;
  gender?: Gender;
  age?: number;
  specialization?: string; // For doctors
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

const USERS_KEY = 'hms_users';

// Utility functions for localStorage CRUD
export function getAllUsers(): IUser[] {
  const data = localStorage.getItem(USERS_KEY);
  if (data) return JSON.parse(data);
  // Hardcoded seeds
  const today = new Date();
  const specializations = [
    "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "Radiology", "Oncology", "ENT", "Ophthalmology", "General Medicine"
  ];
  const doctorNames = [
    "Dr. Alice Smith", "Dr. Bob Lee", "Dr. Carol White", "Dr. David Kim", "Dr. Eva Green", "Dr. Frank Black", "Dr. Grace Brown", "Dr. Henry Stone", "Dr. Ivy Young", "Dr. Jack Fox"
  ];
  const doctors: IUser[] = [];
  for (let i = 0; i < 10; i++) {
    doctors.push({
      id: `doctor-seed-${i+1}`,
      name: doctorNames[i],
      email: `doctor${i+1}@yahya.com`,
      password: "123456",
      role: "doctor",
      specialization: specializations[i],
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
    });
  }
  const admin: IUser = {
    id: "admin-seed-1",
    name: "Sid Admin",
    email: "sid@admin.com",
    password: "123456",
    role: "admin",
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
  };
  return [admin, ...doctors];
}

export function saveAllUsers(users: IUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function addUser(user: IUser): void {
  const users = getAllUsers();
  users.push(user);
  saveAllUsers(users);
}

export function updateUser(updated: IUser): void {
  const users = getAllUsers().map(u => u.id === updated.id ? updated : u);
  saveAllUsers(users);
}

export function deleteUser(id: string): void {
  const users = getAllUsers().filter(u => u.id !== id);
  saveAllUsers(users);
}

export function findUserByEmail(email: string): IUser | undefined {
  return getAllUsers().find(u => u.email === email);
}

export function findUserById(id: string): IUser | undefined {
  return getAllUsers().find(u => u.id === id);
}

// Authentication (simple, not secure for production)
export function authenticateUser(email: string, password: string): IUser | undefined {
  const user = findUserByEmail(email);
  return user && user.password === password ? user : undefined;
}
