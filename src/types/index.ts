export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  created_at?: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  failedAttempts: number;
  isLockedOut: boolean;
  lockoutUntil: number | null;
}