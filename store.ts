
import { User, TimeSlot, UserRole, Gender, StaffStatus, SlotShift } from './types';

const USERS_KEY = 'tss_users';
const SLOTS_KEY = 'tss_slots';

const INITIAL_SLOTS: TimeSlot[] = [
  { id: '1', label: 'Basic Training A', startTime: '08:00', endTime: '09:00', shift: SlotShift.MORNING },
  { id: '2', label: 'Advanced Skills', startTime: '09:00', endTime: '10:00', shift: SlotShift.MORNING },
  { id: '3', label: 'Theory Session', startTime: '10:00', endTime: '11:00', shift: SlotShift.MORNING },
  { id: '4', label: 'Practical Lab 1', startTime: '14:00', endTime: '15:00', shift: SlotShift.AFTERNOON },
  { id: '5', label: 'Evening Review', startTime: '16:00', endTime: '17:00', shift: SlotShift.EVENING },
  { id: '6', label: 'Midnight Ops', startTime: '00:00', endTime: '06:00', shift: SlotShift.NIGHT },
];

const INITIAL_ADMIN: User = {
  id: 'admin-1',
  fullName: 'System Administrator',
  email: 'admin@tss.com',
  password: 'admin',
  gender: Gender.OTHER,
  whatsapp: '+123456789',
  role: UserRole.ADMIN,
  isBlocked: false
};

const DEMO_STAFF: User[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `staff-demo-${i + 1}`,
  fullName: `Teacher ${String.fromCharCode(65 + i)}`,
  email: `staff${i + 1}@tss.com`,
  password: 'password',
  gender: Gender.FEMALE,
  whatsapp: `+88017000000${i}`,
  role: UserRole.STAFF,
  status: StaffStatus.APPROVED,
  division: 'Dhaka',
  education: 'Honours / Degree',
  availableHours: '8 Hours',
  phoneBrand: 'Samsung',
  phoneSpecs: '6/128',
  fbLink: `https://facebook.com/staff${i + 1}`,
  displayName: `Teacher ${String.fromCharCode(65 + i)}`,
  assignedTimeSlotId: INITIAL_SLOTS[i % INITIAL_SLOTS.length].id,
  isBlocked: false
}));

const DEMO_SUBSCRIBERS: User[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `sub-demo-${i + 1}`,
  fullName: `Student User ${i + 1}`,
  email: `student${i + 1}@tss.com`,
  password: 'password',
  gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
  whatsapp: `+88018000000${i}`,
  role: UserRole.SUBSCRIBER,
  preferredTimeSlotId: INITIAL_SLOTS[i % INITIAL_SLOTS.length].id,
  assignedTimeSlotId: INITIAL_SLOTS[i % INITIAL_SLOTS.length].id,
  isBlocked: false
}));

export class DB {
  static getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      const initial = [INITIAL_ADMIN, ...DEMO_STAFF, ...DEMO_SUBSCRIBERS];
      localStorage.setItem(USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  static setUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  static getSlots(): TimeSlot[] {
    const data = localStorage.getItem(SLOTS_KEY);
    if (!data) {
      const initial = INITIAL_SLOTS.map((slot, i) => ({
        ...slot,
        teacherId: DEMO_STAFF[i % DEMO_STAFF.length].id
      }));
      localStorage.setItem(SLOTS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  static setSlots(slots: TimeSlot[]) {
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
  }

  static addUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    this.setUsers(users);
  }

  static updateUser(userId: string, updates: Partial<User>) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      this.setUsers(users);
    }
  }

  static deleteUser(userId: string) {
    const users = this.getUsers().filter(u => u.id !== userId);
    this.setUsers(users);
    const slots = this.getSlots();
    let slotsChanged = false;
    slots.forEach(slot => {
      if (slot.teacherId === userId) {
        slot.teacherId = undefined;
        slotsChanged = true;
      }
    });
    if (slotsChanged) {
      this.setSlots(slots);
    }
  }

  static addSlot(slot: TimeSlot) {
    const slots = this.getSlots();
    slots.push(slot);
    this.setSlots(slots);
  }

  static updateSlot(slotId: string, updates: Partial<TimeSlot>) {
    const slots = this.getSlots();
    const idx = slots.findIndex(s => s.id === slotId);
    if (idx !== -1) {
      slots[idx] = { ...slots[idx], ...updates };
      this.setSlots(slots);
    }
  }

  static deleteSlot(slotId: string) {
    const slots = this.getSlots().filter(s => s.id !== slotId);
    this.setSlots(slots);
    const users = this.getUsers();
    let usersChanged = false;
    users.forEach(user => {
      if (user.assignedTimeSlotId === slotId) {
        user.assignedTimeSlotId = undefined;
        usersChanged = true;
      }
      if (user.preferredTimeSlotId === slotId) {
        user.preferredTimeSlotId = undefined;
        usersChanged = true;
      }
    });
    if (usersChanged) {
      this.setUsers(users);
    }
  }
}
