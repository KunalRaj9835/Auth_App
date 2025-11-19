import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { User } from '../store/slices/authSlice';
import {
  loginSuccess,
  logout,
  incrementFailedAttempts,
  checkLockoutExpiry,
  restoreSession,
} from '../store/slices/authSlice';

import {
  saveCredentials,
  getCredentials,
  saveSession,
  getSession,
  deleteSession,
  deleteCredentials,
  hashPassword,
  verifyPassword,
  StoredCredentials,
} from '../utils/secureStorage';

import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);


  useEffect(() => {
    dispatch(checkLockoutExpiry());
    const interval = setInterval(() => dispatch(checkLockoutExpiry()), 60000);
    return () => clearInterval(interval);
  }, [dispatch]);


  const restoreSessionFromStorage = async (): Promise<boolean> => {
    try {
      const session = await getSession();
      if (session) {
        dispatch(restoreSession({ user: session.user, sessionToken: session.sessionToken }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error restoring session:', error);
      return false;
    }
  };

  const register = async (user: Partial<User>, password: string): Promise<void> => {
    try {
      const email = user.email || '';

      
      await deleteCredentials();
      await deleteSession();

      
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        throw new Error('An account with this email already exists. Please login instead.');
      }

      
      const passwordHash = await hashPassword(password);
      const credentials: StoredCredentials = { email, passwordHash };

      
      const userId = generateUserId();

      const fullUser: User = {
        id: userId,
        email,
        first_name: user.first_name || (user as any).firstName || '',
        last_name: user.last_name || (user as any).lastName || '',
        phone_number: user.phone_number || (user as any).phoneNumber,
      };

      
      const { error: supabaseError } = await supabase.from('profiles').insert([
        {
          user_id: fullUser.id,
          email: fullUser.email,
          first_name: fullUser.first_name,
          last_name: fullUser.last_name,
          phone_number: fullUser.phone_number,
        },
      ]);

      if (supabaseError) {
        console.error('Supabase profile create error:', supabaseError);

        if (supabaseError.code === '23505') {
          throw new Error('An account with this email already exists. Please login instead.');
        }

        throw new Error('Failed to create account. Please try again.');
      }

      
      await saveCredentials(credentials);

      
      const sessionToken = generateSessionToken();
      const session = {
        user: fullUser,
        sessionToken,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      };

      await saveSession(session);
      dispatch(loginSuccess({ user: fullUser, sessionToken }));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (authState.isLockedOut) {
        const timeRemaining = authState.lockoutUntil ? authState.lockoutUntil - Date.now() : 0;
        const minutesRemaining = Math.ceil(timeRemaining / 60000);
        throw new Error(`Account locked. Try again in ${minutesRemaining} minute(s).`);
      }

      const credentials = await getCredentials();
      if (!credentials) {
        dispatch(incrementFailedAttempts());
        throw new Error('Invalid credentials');
      }

      
      if (credentials.email !== email || !verifyPassword(password, credentials.passwordHash)) {
        dispatch(incrementFailedAttempts());
        const attempts = authState.failedAttempts + 1;
        if (attempts >= 5) {
          throw new Error('Account locked for 5 minutes due to multiple failed attempts.');
        } else {
          const remaining = 5 - attempts;
          throw new Error(`Invalid credentials. ${remaining} attempt(s) remaining.`);
        }
      }

      
      await deleteSession();

      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      let user: User;

      if (profile) {
        user = {
          id: profile.user_id,
          email: profile.email,
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone_number: profile.phone_number,
        };
      } else {
        
        user = { id: generateUserId(), email, first_name: '', last_name: '' };
      }

      
      const sessionToken = generateSessionToken();
      const session = {
        user,
        sessionToken,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      };

      await saveSession(session);
      dispatch(loginSuccess({ user, sessionToken }));

      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };


  const handleLogout = async (): Promise<void> => {
    try {
      await deleteSession();
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  
  const deleteAccount = async (): Promise<void> => {
    try {
      const session = await getSession();
      const userId = session?.user?.id;

      if (userId) {
        try {
          await supabase.from('user_data').delete().eq('user_id', userId);
          await supabase.from('profiles').delete().eq('user_id', userId);
        } catch (e) {
          console.error('Supabase delete error:', e);
        }
      }

      await deleteCredentials();
      await deleteSession();
      dispatch(logout());
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  };

  const getLockoutTimeRemaining = (): number => {
    if (!authState.isLockedOut || !authState.lockoutUntil) return 0;
    return Math.max(0, authState.lockoutUntil - Date.now());
  };

  return {
    ...authState,
    register,
    login,
    logout: handleLogout,
    deleteAccount,
    restoreSessionFromStorage,
    getLockoutTimeRemaining,
    attemptsRemaining: Math.max(0, 5 - authState.failedAttempts),
  };
};


const generateUserId = (): string =>
  `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateSessionToken = (): string =>
  `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
