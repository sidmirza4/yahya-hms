export interface IDoctorAvailabilitySlot {
  id: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24-hour)
}

const STORAGE_KEY = "doctor_availability";

export function getAllDoctorSlots(): IDoctorAvailabilitySlot[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);
  // Hardcoded slots for doctor-seed-1 ... doctor-seed-10
  const today = new Date();
  const slotTimes = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "16:00", "16:30", "18:00"];
  const slots: IDoctorAvailabilitySlot[] = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 3; j++) {
      const d = new Date();
      d.setDate(today.getDate() + i + j + 1); // Spread out slots in future
      slots.push({
        id: `slot-seed-${i+1}-${j+1}`,
        doctorId: `doctor-seed-${i+1}`,
        date: d.toISOString().slice(0, 10),
        time: slotTimes[(i + j) % slotTimes.length],
      });
    }
  }
  return slots;
}

export function getDoctorSlotsByDoctor(doctorId: string): IDoctorAvailabilitySlot[] {
  return getAllDoctorSlots().filter(slot => slot.doctorId === doctorId);
}

export function addDoctorSlot(slot: IDoctorAvailabilitySlot): void {
  const slots = getAllDoctorSlots();
  slots.push(slot);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
}

export function deleteDoctorSlot(slotId: string): void {
  const slots = getAllDoctorSlots().filter(slot => slot.id !== slotId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
}

export function isSlotAvailable(doctorId: string, date: string, time: string): boolean {
  // Returns true if the slot is not booked
  const slots = getDoctorSlotsByDoctor(doctorId);
  return slots.some(slot => slot.date === date && slot.time === time);
}
