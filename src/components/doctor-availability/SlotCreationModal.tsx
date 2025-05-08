"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import { FIXED_TIME_SLOTS } from "@src/utils/timeSlots";
import { addDoctorSlot } from "@actions/doctorAvailability";
import { format, addDays, parse } from "date-fns";

interface SlotCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  onSuccess: () => void;
  defaultDate?: Date;
}

export default function SlotCreationModal({
  isOpen,
  onClose,
  doctorId,
  onSuccess,
  defaultDate,
}: SlotCreationModalProps) {
  const [date, setDate] = useState(defaultDate ? format(defaultDate, "yyyy-MM-dd") : "");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringWeeks, setRecurringWeeks] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTimeToggle = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time)
        ? prev.filter((t) => t !== time)
        : [...prev, time]
    );
  };

  const handleSubmit = async () => {
    if (!date || selectedTimes.length === 0) {
      setError("Please select a date and at least one time slot");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // For non-recurring appointments, just add the selected slots
      if (!isRecurring) {
        for (const time of selectedTimes) {
          await addDoctorSlot({
            doctorId,
            date,
            time,
          });
        }
      } else {
        // For recurring appointments, add slots for the specified number of weeks
        const parsedDate = parse(date, "yyyy-MM-dd", new Date());
        
        for (let week = 0; week < recurringWeeks; week++) {
          const currentDate = addDays(parsedDate, week * 7);
          const formattedDate = format(currentDate, "yyyy-MM-dd");
          
          for (const time of selectedTimes) {
            await addDoctorSlot({
              doctorId,
              date: formattedDate,
              time,
            });
          }
        }
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating slots:", error);
      setError("Failed to create slots. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Availability Slots</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="space-y-2">
            <Label>Select Time Slots</Label>
            <div className="grid grid-cols-3 gap-2">
              {FIXED_TIME_SLOTS.map((time) => (
                <div
                  key={time}
                  className={`p-2 border rounded cursor-pointer text-center ${
                    selectedTimes.includes(time)
                      ? "bg-blue-100 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleTimeToggle(time)}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              checked={isRecurring}
              onCheckedChange={(checked) => setIsRecurring(checked === true)}
            />
            <Label htmlFor="recurring">Make this a recurring schedule</Label>
          </div>

          {isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="weeks">Repeat for how many weeks?</Label>
              <select
                id="weeks"
                value={recurringWeeks}
                onChange={(e) => setRecurringWeeks(Number(e.target.value))}
                className="w-full border rounded p-2"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "week" : "weeks"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Slots"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
