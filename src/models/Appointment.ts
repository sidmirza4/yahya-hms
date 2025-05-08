import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Type for frontend usage
export interface IAppointment {
  _id: string;
  patientId: string;
  doctorId: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
export default Appointment;
