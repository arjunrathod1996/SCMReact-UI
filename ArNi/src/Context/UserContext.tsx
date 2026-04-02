import React from "react";

export type User = {
  id: number;
  name: string;
  roles: string[];
  email?: string;
};

export type UserContextType = {
  user: User | null;
  loading: boolean;
  refreshUser?: () => Promise<void>;
};

export const UserContext = React.createContext<UserContextType | null>(null);
