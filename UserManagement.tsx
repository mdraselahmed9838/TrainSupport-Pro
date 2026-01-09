
import React, { useState, useEffect, useMemo } from 'react';
import { DB } from '../../store';
import { User, UserRole } from '../../types';
import { useAuth } from '../../App';
import { 
  ShieldCheck, ShieldAlert, Key, Trash2, Search, Power, PowerOff, Lock, AlertTriangle 
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordTarget, setPasswordTarget] = useState<User | null>(null);
  const [statusTarget, setStatusTarget] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setUsers(DB.getUsers());
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleStatusToggle = () => {
    if (!statusTarget) return;
    if (statusTarget.id === auth.user?.id) {
      alert("System Safety: You cannot deactivate yourself.");
      setStatusTarget(null);
      return;
    }
    DB.updateUser(statusTarget.id, { isBlocked: !statusTarget.isBlocked });
    setStatusTarget(null);
    refresh();
  };

  const handleRoleChange = (id: string, role: UserRole) => {
    if (id === auth.user?.id && role !== UserRole.ADMIN) {
      alert("Permission Error: Self-demotion is restricted.");
      return;
    }
    DB.updateUser(id, { role });
    refresh();
  };

  const handlePassReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordTarget && newPassword.trim()) {
      DB.updateUser(passwordTarget.id, { password: newPassword });
      alert('Security Update: Password changed successfully.');
      setPasswordTarget(null);
      setNewPassword('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Global User Listing</h1>
      </div>

      <div className="bg-white p-4 rounded-2xl border flex items-center gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            className="w-full bg-slate-50 border rounded-xl p-3 pl-12 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Find by name, ID or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="px-4 text-sm font-bold text-slate-500 bg-slate-100 py-3 rounded-xl whitespace-nowrap">
          {filteredUsers.length} Results
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-x-auto shadow-sm">
        <table className="w-full text-sm min-w-[850px]">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b">
            <tr>
              <th className="text-left p-4">User ID</th>
              <th className="text-left p-4">Identity</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Permission Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map(user => (
              <tr key={user.id} className={`transition-colors ${user.isBlocked ? 'bg-red-50/20 grayscale opacity-60' : 'hover:bg-slate-50'}`}>
                <td className="p-4 font-mono text-[10px] text-slate-400">{user.id}</td>
                <td className="p-4">
                  <div className="font-bold text-slate-800">{user.fullName}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </td>
                <td className="p-4">
                  <select 
                    className="bg-white border rounded px-2 py-1 text-xs font-bold text-slate-700"
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                  >
                    <option value={UserRole.ADMIN}>ADMIN</option>
                    <option value={UserRole.STAFF}>STAFF</option>
                    <option value={UserRole.SUBSCRIBER}>SUBSCRIBER</option>
                  </select>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => setStatusTarget(user)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                      user.isBlocked 
                      ? 'bg-red-50 text-red-600 border-red-200' 
                      : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {user.isBlocked ? <PowerOff size={12} /> : <Power size={12} />}
                    {user.isBlocked ? 'Inactive' : 'Active'}
                  </button>
                </td>
                <td className="p-4 text-right space-x-1">
                  <button onClick={() => setPasswordTarget(user)} className="p-2 text-slate-400 hover:text-blue-600 transition" title="Change Password"><Key size={16} /></button>
                  <button onClick={() => { if(confirm('Delete user permanently?')) { DB.deleteUser(user.id); refresh(); } }} className="p-2 text-slate-400 hover:text-red-600 transition" title="Delete Account"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Password Reset Modal */}
      {passwordTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <form onSubmit={handlePassReset} className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl border animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 text-center mb-6 uppercase tracking-tight">Modify Credentials</h3>
            <input 
              type="text" 
              className="w-full border-2 border-slate-100 rounded-2xl p-4 text-center font-bold text-lg outline-none focus:border-blue-500"
              placeholder="New Secure Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => setPasswordTarget(null)} className="flex-1 bg-slate-100 text-slate-600 p-3 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="flex-1 bg-blue-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-blue-100">Update Password</button>
            </div>
          </form>
        </div>
      )}

      {/* Status Toggle Modal */}
      {statusTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl border animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800 text-center mb-2 uppercase">Account Suspension</h3>
            <p className="text-slate-500 text-sm text-center mb-8">
              Confirm status change for <strong>{statusTarget.fullName}</strong>. If deactivated, they will be logged out and lose all access immediately.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setStatusTarget(null)} className="flex-1 bg-slate-100 text-slate-600 p-3 rounded-xl font-bold">Cancel</button>
              <button onClick={handleStatusToggle} className={`flex-1 text-white p-3 rounded-xl font-bold ${statusTarget.isBlocked ? 'bg-emerald-600' : 'bg-red-600'}`}>
                {statusTarget.isBlocked ? 'Activate' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
