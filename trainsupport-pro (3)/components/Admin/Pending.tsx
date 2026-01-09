
import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { User, UserRole, StaffStatus } from '../../types';
import { FileText, CheckCircle, XCircle, Eye } from 'lucide-react';

const Pending: React.FC = () => {
  const [apps, setApps] = useState<User[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setApps(DB.getUsers().filter(u => u.role === UserRole.STAFF && u.status === StaffStatus.PENDING));
  };

  const handleAction = (id: string, status: StaffStatus) => {
    DB.updateUser(id, { status });
    refresh();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800">Pending Staff Applications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map(app => (
          <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {app.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{app.fullName}</h3>
                <p className="text-xs text-slate-500">{app.email}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <button onClick={() => handleAction(app.id, StaffStatus.APPROVED)} className="flex-1 bg-green-600 text-white p-2 rounded-lg text-xs font-bold hover:bg-green-700 transition">Approve</button>
              <button onClick={() => handleAction(app.id, StaffStatus.REJECTED)} className="flex-1 bg-red-50 text-red-600 p-2 rounded-lg text-xs font-bold hover:bg-red-100 transition">Reject</button>
            </div>
          </div>
        ))}
        {apps.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 italic">No pending recruitment applications.</div>
        )}
      </div>
    </div>
  );
};

export default Pending;
