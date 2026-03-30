import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import * as authService from "../services/api";
import { addReaction } from "../services/api";

interface User {
  user_id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    authService
      .getMe()
      .then((data) =>
        setUser({ user_id: data.user_id, username: data.username })
      )
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) return;

    const pending = localStorage.getItem('pending_reaction');
    if (pending) {
        addReaction(JSON.parse(pending))
            .catch(() => console.error('Failed to post pending reaction'))
            .finally(() => localStorage.removeItem('pending_reaction'));
    }
}, [user]);

  const login = async (username: string, password: string) => {
    const data = await authService.login(username, password);
    setUser({ user_id: data.user_id, username: data.username });

  };

  const logout = () => {
    authService.logout();

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
