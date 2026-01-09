
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, AuthState, UserRole } from './types';
import { DB } from './store';
import { Login, Register } from './components/Auth';
import StaffRegister from './components/StaffRegister';
import Dashboard from './components/Dashboard';
import { Layout } from './components/Layout';

// Admin Modular Components
import Pending from './components/Admin/Pending';
import Teachers from './components/Admin/Teachers';
import Students from './components/Admin/Students';
import TimeSlots from './components/Admin/TimeSlots';
import UserManagement from './components/Admin/UserManagement';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  refreshUser: () => void;
  checkSuspension: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('tss_session');
    return saved ? { user: JSON.parse(saved), isAuthenticated: true } : { user: null, isAuthenticated: false };
  });

  const login = (email: string, pass: string) => {
    const users = DB.getUsers();
    const user = users.find(u => u.email === email && u.password === pass);
    
    if (user) {
      if (user.isBlocked) {
        return { success: false, error: 'Your account is currently Inactive. Please contact an administrator.' };
      }
      setAuth({ user, isAuthenticated: true });
      localStorage.setItem('tss_session', JSON.stringify(user));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('tss_session');
  };

  const refreshUser = () => {
    if (auth.user) {
      const users = DB.getUsers();
      const updated = users.find(u => u.id === auth.user?.id);
      if (updated) {
        setAuth({ ...auth, user: updated });
        localStorage.setItem('tss_session', JSON.stringify(updated));
      }
    }
  };

  const checkSuspension = () => {
    if (auth.user) {
      const users = DB.getUsers();
      const currentUser = users.find(u => u.id === auth.user?.id);
      if (currentUser && currentUser.isBlocked) {
        logout();
        window.location.href = '#/login?error=inactive';
      }
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, refreshUser, checkSuspension }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={!auth.isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!auth.isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/staff-register" element={<StaffRegister />} />
          
          <Route element={auth.isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
            <Route path="/" element={<Dashboard />} />
            
            {/* Admin Specific Routes */}
            <Route path="/pending" element={<Pending />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/students" element={<Students />} />
            <Route path="/timeslots" element={<TimeSlots />} />
            <Route path="/users" element={<UserManagement />} />
            
            <Route path="/profile" element={<ProfileView />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
};

const ProfileView = () => {
  const { auth, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    if (auth.user) {
      setDisplayName(auth.user.displayName || auth.user.fullName);
      setWhatsapp(auth.user.whatsapp);
    }
  }, [auth.user]);

  if (!auth.user) return null;

  const handleSave = () => {
    DB.updateUser(auth.user!.id, { displayName, whatsapp });
    refreshUser();
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Account Profile</h1>
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Display Name</label>
          {isEditing ? (
            <input className="w-full border p-2 rounded mt-1" value={displayName} onChange={e => setDisplayName(e.target.value)} />
          ) : (
            <p className="font-bold text-slate-800">{auth.user.displayName || auth.user.fullName}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">WhatsApp</label>
          {isEditing ? (
            <input className="w-full border p-2 rounded mt-1" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
          ) : (
            <p className="font-bold text-slate-800">{auth.user.whatsapp}</p>
          )}
        </div>
        <div className="pt-4">
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
