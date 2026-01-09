
import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { 
  LayoutDashboard, UserCircle, LogOut, BookOpenCheck, 
  Users, Clock, FileText, ShieldCheck, GraduationCap
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { auth, logout, checkSuspension } = useAuth();
  const location = useLocation();

  useEffect(() => {
    checkSuspension();
  }, [location.pathname]);

  const isAdmin = auth.user?.role === UserRole.ADMIN;

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  ];

  const adminItems = [
    { label: 'User Listing', path: '/users', icon: <ShieldCheck size={20} /> },
    { label: 'Pending Apps', path: '/pending', icon: <FileText size={20} /> },
    { label: 'Teachers', path: '/teachers', icon: <Users size={20} /> },
    { label: 'Students', path: '/students', icon: <GraduationCap size={20} /> },
    { label: 'Time Slots', path: '/timeslots', icon: <Clock size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-64 bg-white border-r flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <BookOpenCheck size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">TrainPro</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}

          {isAdmin && (
            <>
              <div className="pt-4 pb-2 px-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">Administration</div>
              {adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    location.pathname === item.path ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </>
          )}

          <div className="pt-4 pb-2 px-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">Account</div>
          <Link
            to="/profile"
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              location.pathname === '/profile' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <UserCircle size={20} /> My Profile
          </Link>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
