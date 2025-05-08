"use server";

import { hash } from "bcryptjs";
import dbConnect from "@lib/mongodb";
import User from "@models/User";
import Appointment from "@models/Appointment";
import DoctorAvailability from "@models/DoctorAvailability";
import { addDays, format } from "date-fns";

// Define interfaces for our data types
interface IPatient {
	name: string;
	email: string;
	password: string;
	age: number;
	gender: string;
	role?: string;
	_id?: string;
}

interface IDoctor {
	name: string;
	email: string;
	password: string;
	specialization: string;
	role?: string;
	_id?: string;
}

interface IAdmin {
	name: string;
	email: string;
	password: string;
	role: string;
	_id?: string;
}

interface IAppointment {
	patientId: string;
	doctorId: string;
	date: string;
	status: string;
	notes?: string;
	_id?: string;
}

// Sample data
const patients: IPatient[] = [
	{
		name: "John Doe",
		email: "john@patient.com",
		password: "patient1",
		age: 35,
		gender: "male",
	},
	{
		name: "Jane Smith",
		email: "jane@patient.com",
		password: "patient2",
		age: 28,
		gender: "female",
	},
	{
		name: "Robert Johnson",
		email: "robert@patient.com",
		password: "patient3",
		age: 42,
		gender: "male",
	},
	{
		name: "Emily Davis",
		email: "emily@patient.com",
		password: "patient4",
		age: 31,
		gender: "female",
	},
	{
		name: "Michael Wilson",
		email: "michael@patient.com",
		password: "patient5",
		age: 45,
		gender: "male",
	},
];

const doctors: IDoctor[] = [
	{
		name: "Dr. Sarah Miller",
		email: "sarah@doctor.com",
		password: "doctor1",
		specialization: "Cardiology",
	},
	{
		name: "Dr. James Brown",
		email: "james@doctor.com",
		password: "doctor2",
		specialization: "Neurology",
	},
	{
		name: "Dr. Lisa Taylor",
		email: "lisa@doctor.com",
		password: "doctor3",
		specialization: "Pediatrics",
	},
	{
		name: "Dr. David Clark",
		email: "david@doctor.com",
		password: "doctor4",
		specialization: "Orthopedics",
	},
	{
		name: "Dr. Jennifer White",
		email: "jennifer@doctor.com",
		password: "doctor5",
		specialization: "Dermatology",
	},
];

const admin: IAdmin = {
	name: "Yahya Admin",
	email: "yahya@admin.com",
	password: "adminy",
	role: "admin",
};

// Statuses for appointments
const statuses = ["pending", "confirmed", "completed", "cancelled"];

// Time slots for appointments
const timeSlots = [
	"09:00",
	"09:30",
	"10:00",
	"10:30",
	"11:00",
	"11:30",
	"12:00",
	"12:30",
	"13:00",
	"13:30",
	"14:00",
	"14:30",
	"15:00",
	"15:30",
	"16:00",
	"16:30",
	"17:00",
	"17:30",
];

// Function to generate a random date within the next 30 days
const getRandomFutureDate = () => {
	const daysToAdd = Math.floor(Math.random() * 30) + 1;
	return addDays(new Date(), daysToAdd);
};

// Function to get a random item from an array
const getRandomItem = (array: any[]) => {
	return array[Math.floor(Math.random() * array.length)];
};

export async function seedDatabase() {
	try {
		console.log("Attempting to connect to database...");
		if (!process.env.MONGODB_URI) {
			console.error("MONGODB_URI is not defined in environment variables");
			return {
				success: false,
				message: "MongoDB URI is not defined",
				error: "Missing MONGODB_URI environment variable"
			};
		}
		
		await dbConnect();

		console.log("Connected to database. Starting seed process...");

		// Clear existing data
		await User.deleteMany({});
		await Appointment.deleteMany({});
		await DoctorAvailability.deleteMany({});

		console.log("Cleared existing data");

		// Create admin user
		const hashedAdminPassword = await hash(admin.password, 10);
		const adminUser = await User.create({
			...admin,
			password: hashedAdminPassword,
		});

		console.log("Created admin user");

		// Create patients
		const createdPatients: any[] = [];
		for (const patient of patients) {
			const hashedPassword = await hash(patient.password, 10);
			const newPatient = await User.create({
				...patient,
				password: hashedPassword,
				role: "patient",
			});
			createdPatients.push(newPatient);
		}

		console.log("Created patients");

		// Create doctors
		const createdDoctors: any[] = [];
		for (const doctor of doctors) {
			const hashedPassword = await hash(doctor.password, 10);
			const newDoctor = await User.create({
				...doctor,
				password: hashedPassword,
				role: "doctor",
			});
			createdDoctors.push(newDoctor);
		}

		console.log("Created doctors");

		// Create doctor availability slots
		for (const doctor of createdDoctors) {
			// Add availability for the next 14 days
			for (let day = 1; day <= 14; day++) {
				const date = addDays(new Date(), day);
				const formattedDate = format(date, "yyyy-MM-dd");

				// Add 3-5 random time slots per day
				const numSlots = Math.floor(Math.random() * 3) + 3;
				const daySlots = [...timeSlots]
					.sort(() => 0.5 - Math.random())
					.slice(0, numSlots);

				for (const time of daySlots) {
					await DoctorAvailability.create({
						doctorId: doctor._id,
						date: formattedDate,
						time,
					});
				}
			}
		}

		console.log("Created doctor availability slots");

		// Create appointments
		const appointments: any[] = [];

		// Create 3 appointments for each patient
		for (const patient of createdPatients) {
			for (let i = 0; i < 3; i++) {
				const doctor = getRandomItem(createdDoctors);
				const date = getRandomFutureDate();
				const formattedDate = format(date, "yyyy-MM-dd");
				const time = getRandomItem(timeSlots);
				const status = getRandomItem(statuses);

				const appointment = await Appointment.create({
					patientId: patient._id,
					doctorId: doctor._id,
					date: `${formattedDate}T${time}:00`,
					status,
					notes: status === "completed" ? "Patient is doing well." : "",
				});

				appointments.push(appointment);
			}
		}

		console.log("Created appointments");

		return {
			success: true,
			message: "Database seeded successfully",
			counts: {
				patients: createdPatients.length,
				doctors: createdDoctors.length,
				appointments: appointments.length,
			},
		};
	} catch (error) {
		console.error("Error seeding database:", error);
		// Log more detailed error information
		if (error instanceof Error) {
			console.error("Error name:", error.name);
			console.error("Error message:", error.message);
			console.error("Error stack:", error.stack);
		}
		
		return {
			success: false,
			message: "Error seeding database",
			error: error instanceof Error ? error.message : String(error),
		};
	}
}

// Get sample users for the login helper modal
export async function getSampleUsers() {
	return {
		patients: [
			{ email: "john@patient.com", password: "patient1" },
			{ email: "jane@patient.com", password: "patient2" },
		],
		doctors: [
			{ email: "sarah@doctor.com", password: "doctor1" },
			{ email: "james@doctor.com", password: "doctor2" },
		],
		admin: { email: "yahya@admin.com", password: "adminy" },
	};
}
