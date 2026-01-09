
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  SUBSCRIBER = 'SUBSCRIBER'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum StaffStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum SlotShift {
  MORNING = 'Morning',
  AFTERNOON = 'Afternoon',
  EVENING = 'Evening',
  NIGHT = 'Night'
}

export interface PrivateNote {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  gender: Gender;
  whatsapp: string;
  role: UserRole;
  isBlocked?: boolean;
  
  // Registration metadata
  preferredTimeSlotId?: string; // For subscribers
  assignedTimeSlotId?: string; // Set by Admin
  
  // Staff Specific Fields (Recruitment)
  status?: StaffStatus;
  agreement?: boolean;
  religion?: 'ISLAM' | 'HINDU';
  division?: string;
  education?: string;
  phoneNumber?: string;
  relationshipStatus?: string;
  deviceSelection?: 'PHONE' | 'COMPUTER' | 'BOTH';
  birthOrder?: string;
  isRegularStudent?: boolean;
  usesImo?: string;
  phoneBrand?: string;
  phoneSpecs?: string;
  previousSites?: string;
  availableHours?: string;
  fbLink?: string; // Facebook Profile/Page Link
  
  // Private Notes (Staff/Admin only)
  privateNotes?: PrivateNote[];
  
  // Profile Editable after verification
  displayName?: string;
}

export interface TimeSlot {
  id: string;
  label: string; // The "Option" or Name
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  shift: SlotShift;
  teacherId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
