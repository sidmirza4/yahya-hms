"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { addDoctorSlot } from "@actions/doctorAvailability";
import { format, addDays, addWeeks } from "date-fns";
import { FIXED_TIME_SLOTS, getStartTimeFromRange } from "@src/utils/timeSlots";

interface QuickActionsProps {
  doctorId: string;
  onSlotsChange: () => void;
}

export default function QuickActions({ doctorId, onSlotsChange }: QuickActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);

  // Add slots for today
  const addSlotsForToday = async () => {
    await addSlotsForDays(0);
  };

  // Add slots for next 7 days
  const addSlotsForWeek = async () => {
    await addSlotsForDays(7);
  };

  // Add morning slots (9:00 - 12:30) for next 30 days
  const addMorningSlots = async () => {
    const morningSlots = FIXED_TIME_SLOTS.filter(
      time => {
        const startTime = getStartTimeFromRange(time);
        const hour = parseInt(startTime.split(":")[0]);
        return hour >= 9 && hour < 13;
      }
    );
    
    await addSlotsWithPattern(morningSlots, 30);
  };

  // Add afternoon slots (13:00 - 17:30) for next 30 days
  const addAfternoonSlots = async () => {
    const afternoonSlots = FIXED_TIME_SLOTS.filter(
      time => {
        const startTime = getStartTimeFromRange(time);
        const hour = parseInt(startTime.split(":")[0]);
        return hour >= 13;
      }
    );
    
    await addSlotsWithPattern(afternoonSlots, 30);
  };

  // Helper function to add slots for a specific number of days
  const addSlotsForDays = async (days: number) => {
    try {
      setIsLoading(true);
      setActionType(days === 0 ? "today" : "week");
      
      const today = new Date();
      const endDate = days === 0 ? today : addDays(today, days);
      
      for (let day = 0; day <= days; day++) {
        const currentDate = addDays(today, day);
        const formattedDate = format(currentDate, "yyyy-MM-dd");
        
        // Add all time slots for this day
        for (const timeRange of FIXED_TIME_SLOTS) {
          try {
            // Extract the start time from the time range (e.g., "09:00-09:30" -> "09:00")
            const startTime = getStartTimeFromRange(timeRange);
            
            await addDoctorSlot({
              doctorId,
              date: formattedDate,
              time: startTime,
            });
          } catch (error) {
            // Ignore duplicate slot errors
            console.log("Slot might already exist:", formattedDate, timeRange);
          }
        }
      }
      
      onSlotsChange();
    } catch (error) {
      console.error("Error adding slots:", error);
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  // Helper function to add slots with a specific pattern
  const addSlotsWithPattern = async (timeSlots: string[], days: number) => {
    try {
      setIsLoading(true);
      const firstSlotStartTime = getStartTimeFromRange(timeSlots[0]);
      setActionType(firstSlotStartTime.startsWith("09") ? "morning" : "afternoon");
      
      const today = new Date();
      
      for (let day = 0; day < days; day++) {
        const currentDate = addDays(today, day);
        
        // Skip weekends (0 = Sunday, 6 = Saturday)
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;
        
        const formattedDate = format(currentDate, "yyyy-MM-dd");
        
        // Add the specified time slots for this day
        for (const timeRange of timeSlots) {
          try {
            // Extract the start time from the time range
            const startTime = getStartTimeFromRange(timeRange);
            
            await addDoctorSlot({
              doctorId,
              date: formattedDate,
              time: startTime,
            });
          } catch (error) {
            // Ignore duplicate slot errors
            console.log("Slot might already exist:", formattedDate, timeRange);
          }
        }
      }
      
      onSlotsChange();
    } catch (error) {
      console.error("Error adding slots with pattern:", error);
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md border shadow w-full">
      <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
      
      <div className="grid grid-cols-1 gap-2">
        <Button
          variant="outline"
          onClick={addSlotsForToday}
          disabled={isLoading}
          className="justify-start w-full h-auto py-2 text-sm"
        >
          {isLoading && actionType === "today" ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            "Add All Slots for Today"
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={addSlotsForWeek}
          disabled={isLoading}
          className="justify-start w-full h-auto py-2 text-sm"
        >
          {isLoading && actionType === "week" ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            "Add All Slots for Next 7 Days"
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={addMorningSlots}
          disabled={isLoading}
          className="justify-start w-full h-auto py-2 text-sm"
        >
          {isLoading && actionType === "morning" ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            "Add Morning Slots (Weekdays)"
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={addAfternoonSlots}
          disabled={isLoading}
          className="justify-start w-full h-auto py-2 text-sm"
        >
          {isLoading && actionType === "afternoon" ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            "Add Afternoon Slots (Weekdays)"
          )}
        </Button>
      </div>
    </div>
  );
}
