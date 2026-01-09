
import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { User, TimeSlot, UserRole } from '../../types';
import { GraduationCap, Clock, Trash2 } from 'lucide-react';

const Students: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setStudents(DB.getUsers().filter(u => u.role === UserRole.SUBSCRIBER));
    setSlots(DB.getSlots());
  };

  const updateSlot = (studentId: string, slotId: string) => {
    DB.updateUser(studentId, { assignedTimeSlotId: slotId });
    refresh();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800">Student Enrollment</h1>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b">
            <tr>
              <th className="text-left p-4">Student</th>
              <th className="text-left p-4">Current Slot</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {students.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{s.fullName}</div>
                  <div className="text-[10px] text-slate-400">{s.email}</div>
                </td>
                <td className="p-4">
                  <select 
                    className="border rounded p-1 text-xs" 
                    value={s.assignedTimeSlotId || ''} 
                    onChange={e => updateSlot(s.id, e.target.value)}
                  >
                    <option value="">No Assignment</option>
                    {slots.map(sl => <option key={sl.id} value={sl.id}>{sl.label}</option>)}
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => { DB.deleteUser(s.id); refresh(); }} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && <div className="p-10 text-center text-slate-400 italic">No registered students.</div>}
      </div>
    </div>
  );
};

export default Students;
