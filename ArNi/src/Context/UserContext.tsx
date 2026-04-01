type User = {
  id: number;
  name: string;
  roles: string[];
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = React.createContext<UserContextType | null>(null);
