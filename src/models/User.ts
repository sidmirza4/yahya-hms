import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["patient", "doctor", "admin"],
			required: true,
		},
		phone: {
			type: String,
		},
		address: {
			type: String,
		},
		gender: {
			type: String,
			enum: ["male", "female", "other"],
		},
		age: {
			type: Number,
		},
		specialization: {
			type: String,
			// Only for doctors
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

// Type for frontend usage
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "doctor" | "patient";
  phone?: string;
  address?: string;
  gender?: "male" | "female" | "other";
  age?: number;
  specialization?: string;
  createdAt: string;
  updatedAt: string;
}


