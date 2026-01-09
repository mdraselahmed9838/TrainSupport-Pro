
import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { User, UserRole, StaffStatus } from '../../types';
import { Users, Mail, Phone, Trash2 } from 'lucide-react';

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<User[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setTeachers(DB.getUsers().filter(u => u.role === UserRole.STAFF && u.status === StaffStatus.APPROVED));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800">Verified Instructors</h1>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">WhatsApp</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {teachers.map(t => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">{t.fullName}</td>
                <td className="p-4 text-slate-500">{t.email}</td>
                <td className="p-4">{t.whatsapp}</td>
                <td className="p-4 text-right">
                  <button onClick={() => { DB.deleteUser(t.id); refresh(); }} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {teachers.length === 0 && <div className="p-10 text-center text-slate-400 italic">No verified teachers found.</div>}
      </div>
    </div>
  );
};

export default Teachers;
