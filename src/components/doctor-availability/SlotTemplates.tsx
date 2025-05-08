"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { FIXED_TIME_SLOTS } from "@src/utils/timeSlots";

// Template type definition
interface SlotTemplate {
  id: string;
  name: string;
  timeSlots: string[];
}

interface SlotTemplatesProps {
  onApplyTemplate: (timeSlots: string[]) => void;
}

export default function SlotTemplates({ onApplyTemplate }: SlotTemplatesProps) {
  // Local storage key for templates
  const TEMPLATES_STORAGE_KEY = "doctor-slot-templates";
  
  // State for templates and form
  const [templates, setTemplates] = useState<SlotTemplate[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [newTemplateName, setNewTemplateName] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Toggle time selection
  const handleTimeToggle = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time) 
        : [...prev, time]
    );
  };

  // Save template
  const handleSaveTemplate = () => {
    if (!newTemplateName || selectedTimes.length === 0) return;
    
    const newTemplate: SlotTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      timeSlots: [...selectedTimes]
    };
    
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updatedTemplates));
    }
    
    // Reset form
    setNewTemplateName("");
    setSelectedTimes([]);
    setIsCreating(false);
  };

  // Delete template
  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(template => template.id !== id);
    setTemplates(updatedTemplates);
    
    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updatedTemplates));
    }
  };

  // Apply template
  const handleApplyTemplate = (template: SlotTemplate) => {
    onApplyTemplate(template.timeSlots);
  };

  return (
    <div className="bg-white p-4 rounded-md border shadow">
      <h3 className="text-lg font-semibold mb-3">Schedule Templates</h3>
      
      {templates.length === 0 && !isCreating ? (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-2">No templates saved yet</p>
          <Button onClick={() => setIsCreating(true)}>Create Template</Button>
        </div>
      ) : (
        <>
          {!isCreating && (
            <div className="mb-4">
              <Button onClick={() => setIsCreating(true)}>Create New Template</Button>
            </div>
          )}
          
          {isCreating && (
            <div className="space-y-3 mb-4 p-3 border rounded-md bg-gray-50">
              <div>
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g., Morning Shift"
                />
              </div>
              
              <div>
                <Label>Select Time Slots</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {FIXED_TIME_SLOTS.map((time) => (
                    <div
                      key={time}
                      className={`p-2 border rounded cursor-pointer text-center text-sm ${
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
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveTemplate}
                  disabled={!newTemplateName || selectedTimes.length === 0}
                >
                  Save Template
                </Button>
              </div>
            </div>
          )}
          
          {templates.length > 0 && (
            <ul className="space-y-2">
              {templates.map(template => (
                <li 
                  key={template.id} 
                  className="flex justify-between items-center border rounded-md p-3 hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-500">
                      {template.timeSlots.length} slots: {template.timeSlots.slice(0, 3).join(", ")}
                      {template.timeSlots.length > 3 ? "..." : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleApplyTemplate(template)}
                    >
                      Apply
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
