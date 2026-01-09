
import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { TimeSlot, SlotShift } from '../../types';
import { Clock, Plus, Trash2, Sun, Moon } from 'lucide-react';

const TimeSlots: React.FC = () => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    setSlots(DB.getSlots());
  }, []);

  const addSlot = () => {
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      label: 'New Session',
      startTime: '09:00',
      endTime: '10:00',
      shift: SlotShift.MORNING
    };
    DB.addSlot(newSlot);
    setSlots(DB.getSlots());
  };

  const removeSlot = (id: string) => {
    DB.deleteSlot(id);
    setSlots(DB.getSlots());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Schedule Management</h1>
        <button onClick={addSlot} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
          <Plus size={18} /> New Slot
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.map(slot => (
          <div key={slot.id} className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              {slot.shift === SlotShift.NIGHT ? <Moon className="text-indigo-500" /> : <Sun className="text-amber-500" />}
              <span className="font-bold text-slate-800 uppercase text-xs tracking-widest">{slot.shift} Shift</span>
            </div>
            <h3 className="text-lg font-bold text-slate-700">{slot.label}</h3>
            <p className="text-slate-500 text-sm mb-4">{slot.startTime} - {slot.endTime}</p>
            <button onClick={() => removeSlot(slot.id)} className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1">
              <Trash2 size={14} /> Remove Slot
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;
