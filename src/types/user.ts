
export interface User {
  id: string;
  username: string;
  role: UserRole;
  isAdmin: boolean;
  theme?: string;
  signature?: string;
  lastLogin?: string;
  totalUsageTime?: number;
  firstLogin?: string;
}

export type UserRole = 'General' | 'Auditor' | 'Lead Auditor' | 'Admin';

export interface UserWithPassword extends User {
  password: string;
}
