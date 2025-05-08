"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import { IDoctorAvailabilitySlot } from "@models/DoctorAvailability";
import { deleteDoctorSlot } from "@actions/doctorAvailability";
import { format, parseISO, isAfter } from "date-fns";

interface BatchSlotManagerProps {
  slots: IDoctorAvailabilitySlot[];
  onSlotsChange: () => void;
}

export default function BatchSlotManager({ slots, onSlotsChange }: BatchSlotManagerProps) {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "today">("upcoming");

  // Filter slots based on the selected filter
  const filteredSlots = slots.filter(slot => {
    const slotDate = parseISO(`${slot.date}T${slot.time}`);
    const today = new Date();
    
    switch (filter) {
      case "upcoming":
        return isAfter(slotDate, today);
      case "today":
        return (
          slotDate.getDate() === today.getDate() &&
          slotDate.getMonth() === today.getMonth() &&
          slotDate.getFullYear() === today.getFullYear()
        );
      default:
        return true;
    }
  });

  // Toggle slot selection
  const toggleSlotSelection = (slotId: string) => {
    setSelectedSlots(prev =>
      prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  // Select all visible slots
  const selectAllSlots = () => {
    if (selectedSlots.length === filteredSlots.length) {
      setSelectedSlots([]);
    } else {
      setSelectedSlots(filteredSlots.map(slot => slot._id));
    }
  };

  // Delete selected slots
  const deleteSelectedSlots = async () => {
    if (selectedSlots.length === 0) return;
    
    try {
      setIsDeleting(true);
      
      for (const slotId of selectedSlots) {
        await deleteDoctorSlot(slotId);
      }
      
      setSelectedSlots([]);
      onSlotsChange();
    } catch (error) {
      console.error("Error deleting slots:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md border shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Manage Slots</h3>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "upcoming" | "today")}
            className="border rounded p-1 text-sm"
          >
            <option value="upcoming">Upcoming</option>
            <option value="today">Today</option>
            <option value="all">All</option>
          </select>
          
          {selectedSlots.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={deleteSelectedSlots}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : `Delete (${selectedSlots.length})`}
            </Button>
          )}
        </div>
      </div>
      
      {filteredSlots.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No slots available</p>
      ) : (
        <>
          <div className="flex items-center mb-2 justify-between bg-gray-50 p-2 rounded">
            <div className="flex items-center">
              <Checkbox
                id="select-all"
                checked={selectedSlots.length === filteredSlots.length && filteredSlots.length > 0}
                onCheckedChange={selectAllSlots}
              />
              <Label htmlFor="select-all" className="ml-2 cursor-pointer">
                Select All
              </Label>
            </div>
            <span className="text-sm text-gray-500">
              {filteredSlots.length} slot{filteredSlots.length !== 1 ? "s" : ""}
            </span>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="w-8 py-1.5 px-2 text-left"></th>
                  <th className="py-1.5 px-2 text-left font-medium">Date</th>
                  <th className="py-1.5 px-2 text-left font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlots.map(slot => (
                  <tr 
                    key={slot._id} 
                    className={`border-b hover:bg-gray-50 ${
                      selectedSlots.includes(slot._id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="py-1 px-2">
                      <Checkbox
                        checked={selectedSlots.includes(slot._id)}
                        onCheckedChange={() => toggleSlotSelection(slot._id)}
                        className="h-3.5 w-3.5"
                      />
                    </td>
                    <td className="py-1 px-2 text-gray-700">
                      {format(parseISO(slot.date), "dd MMM yyyy")}
                    </td>
                    <td className="py-1 px-2 font-mono text-gray-700">{slot.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
