import React, { createContext, useEffect, useState } from "react";
import UserService from "../components/service/UserService";


type User = {
  name: string;
  email?:string;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const fetchedUser = await UserService.getCurrentUser();
        setUser(fetchedUser);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
