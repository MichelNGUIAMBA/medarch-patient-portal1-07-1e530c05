
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  name: string;
  role: 'admin' | 'secretary' | 'nurse' | 'lab' | 'doctor';
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
