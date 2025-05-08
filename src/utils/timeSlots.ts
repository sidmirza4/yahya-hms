// Utility to generate fixed 30-minute time slots for a day (e.g., 09:00-09:30 to 17:30-18:00)
export const FIXED_TIME_SLOTS: string[] = [
  "09:00-09:30", "09:30-10:00", "10:00-10:30", "10:30-11:00", "11:00-11:30", "11:30-12:00",
  "12:00-12:30", "12:30-13:00", "13:00-13:30", "13:30-14:00", "14:00-14:30", "14:30-15:00",
  "15:00-15:30", "15:30-16:00", "16:00-16:30", "16:30-17:00", "17:00-17:30", "17:30-18:00"
];

// Helper function to get the start time from a time range
export function getStartTimeFromRange(timeRange: string): string {
  return timeRange.split('-')[0];
}

// Helper function to get the end time from a time range
export function getEndTimeFromRange(timeRange: string): string {
  return timeRange.split('-')[1];
}
