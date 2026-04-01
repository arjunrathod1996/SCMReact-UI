import { create } from 'zustand';
import { Role } from './components/service/RoleService';

export interface User {
  id: number;           // Changed from string to number
  email: string;        // Added based on your error message
  name: string;         // Added based on your error message
  role: Role;
  phoneNumber?: string; // Optional (the '?' handles the 'undefined' error)
  city?: string;        // Optional
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user: User) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
}));