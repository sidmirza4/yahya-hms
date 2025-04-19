"use client";

import { useEffect, useState } from "react";
import { IUser, getAllUsers, addUser, updateUser, deleteUser } from "@src/models/User";
import { IAppointment, getAllAppointments, updateAppointment, deleteAppointment } from "@src/models/Appointment";
import { Button } from "@src/components/ui/button";

const emptyForm: Omit<IUser, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  email: "",
  password: "",
  role: "patient",
  phone: "",
  address: "",
  gender: undefined,
  age: undefined,
  specialization: ""
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsers(getAllUsers());
    setAppointments(getAllAppointments());
  }, []);

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
    setUsers(getAllUsers());
    setAppointments(getAllAppointments().filter(a => a.patientId !== id && a.doctorId !== id));
  };

  const handleDeleteAppointment = (id: string) => {
    deleteAppointment(id);
    setAppointments(getAllAppointments());
  };

  const handleUpdateAppointmentStatus = (id: string, status: "confirmed" | "cancelled") => {
    const appt = appointments.find(a => a.id === id);
    if (!appt) return;
    updateAppointment({ ...appt, status, updatedAt: new Date().toISOString() });
    setAppointments(getAllAppointments());
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }
    if (editingId) {
      // Edit user
      const updated: IUser = {
        ...users.find(u => u.id === editingId)!,
        ...form,
        updatedAt: new Date().toISOString()
      };
      updateUser(updated);
      setUsers(getAllUsers());
      setEditingId(null);
    } else {
      // Add user
      if (users.some(u => u.email === form.email)) {
        setError("Email already exists.");
        return;
      }
      const now = new Date().toISOString();
      const newUser: IUser = {
        ...form,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now
      };
      addUser(newUser);
      setUsers(getAllUsers());
    }
    setForm(emptyForm);
  };

  const handleEditUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    setEditingId(id);
    setForm({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      phone: user.phone || "",
      address: user.address || "",
      gender: user.gender,
      age: user.age,
      specialization: user.specialization || ""
    });
  };

  // Helper to show names instead of IDs
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-white py-10 px-2 sm:px-0 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-blue-100 p-6 sm:p-10">

      <div className="flex items-center gap-3 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-500 drop-shadow-md">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3h-8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
        </svg>
        <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight drop-shadow">Admin Dashboard</h2>
      </div>
      <section className="mb-12">
        <div className="border-b border-blue-100 mb-6" />
        <h3 className="text-xl font-semibold mb-2">Add / Edit User</h3>
        <form onSubmit={handleFormSubmit} className="mb-4 space-y-2 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div>
            <label className="block font-medium">Name</label>
            <input className="border rounded p-2 w-full" name="name" value={form.name} onChange={handleFormChange} />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input className="border rounded p-2 w-full" name="email" value={form.email} onChange={handleFormChange} type="email" />
          </div>
          <div>
            <label className="block font-medium">Password</label>
            <input className="border rounded p-2 w-full" name="password" value={form.password} onChange={handleFormChange} type="password" />
          </div>
          <div>
            <label className="block font-medium">Role</label>
            <select className="border rounded p-2 w-full" name="role" value={form.role} onChange={handleFormChange}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {form.role === "doctor" && (
            <div>
              <label className="block font-medium">Specialization</label>
              <input className="border rounded p-2 w-full" name="specialization" value={form.specialization} onChange={handleFormChange} />
            </div>
          )}
          <div>
            <label className="block font-medium">Phone</label>
            <input className="border rounded p-2 w-full" name="phone" value={form.phone} onChange={handleFormChange} />
          </div>
          <div>
            <label className="block font-medium">Address</label>
            <input className="border rounded p-2 w-full" name="address" value={form.address} onChange={handleFormChange} />
          </div>
          <div>
            <label className="block font-medium">Gender</label>
            <select className="border rounded p-2 w-full" name="gender" value={form.gender || ""} onChange={handleFormChange}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Age</label>
            <input className="border rounded p-2 w-full" name="age" value={form.age || ""} onChange={handleFormChange} type="number" />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit">{editingId ? "Update User" : "Add User"}</Button>
          {editingId && <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button>}
        </form>
        <h3 className="text-xl font-semibold mb-2">Users</h3>
        <ul className="space-y-2 mt-2">
          {users.length === 0 && (
            <li className="flex items-center gap-2 text-gray-400 bg-white p-4 rounded-lg border border-blue-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No users found.
            </li>
          )}
          {users.map(u => (
            <li key={u.id} className="flex flex-col md:flex-row md:items-center md:justify-between bg-blue-50 rounded-lg px-4 py-3 border border-blue-100 shadow-sm hover:shadow transition-all">
              <div>
                <div><span className="font-semibold">Name:</span> {u.name}</div>
                <div><span className="font-semibold">Email:</span> {u.email}</div>
                <div><span className="font-semibold">Role:</span> {u.role}</div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button variant="default" onClick={() => handleEditUser(u.id)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDeleteUser(u.id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <div className="border-b border-blue-100 mb-6" />
        <h3 className="text-xl font-semibold mb-2">Appointments</h3>
        <ul className="space-y-2 mt-2">
          {appointments.length === 0 && (
            <li className="flex items-center gap-2 text-gray-400 bg-white p-4 rounded-lg border border-blue-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No appointments found.
            </li>
          )}
          {appointments.map(a => (
            <li key={a.id} className="flex flex-col md:flex-row md:items-center md:justify-between bg-blue-50 rounded-lg px-4 py-3 border border-blue-100 shadow-sm hover:shadow transition-all">
              <div>
                <div><span className="font-semibold">Patient:</span> {getUserName(a.patientId)}</div>
                <div><span className="font-semibold">Doctor:</span> {getUserName(a.doctorId)}</div>
                <div><span className="font-semibold">Date:</span> {new Date(a.date).toLocaleString()}</div>
                <div><span className="font-semibold">Status:</span> {a.status}</div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                {a.status === "pending" && (
                  <Button variant="default" onClick={() => handleUpdateAppointmentStatus(a.id, "confirmed")}>Approve</Button>
                )}
                {a.status !== "cancelled" && (
                  <Button variant="destructive" onClick={() => handleUpdateAppointmentStatus(a.id, "cancelled")}>Cancel</Button>
                )}
                <Button variant="destructive" onClick={() => handleDeleteAppointment(a.id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </div>
  );
}
