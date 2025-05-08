import mongoose from "mongoose";

const DoctorAvailabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    time: {
      type: String, // Format: HH:MM
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure uniqueness of doctor availability slots
DoctorAvailabilitySchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

// Type for frontend usage
export interface IDoctorAvailabilitySlot {
  _id: string;
  doctorId: string;
  date: string;
  time: string;
  createdAt?: string;
  updatedAt?: string;
}

const DoctorAvailability = mongoose.models.DoctorAvailability || mongoose.model("DoctorAvailability", DoctorAvailabilitySchema);
export default DoctorAvailability;
