import { User } from "./User";

export interface LoginPageProps {
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
}

