import * as SecureStore from 'expo-secure-store';
import { UserProfile } from '../types';
import * as Crypto from 'expo-crypto';

const CREDENTIALS_KEY = 'user_credentials';
const SESSION_KEY = 'user_session';

export interface StoredCredentials {
  email: string;
  passwordHash: string; // In production, use bcrypt or similar
}

export interface StoredSession {
  user: UserProfile;
  sessionToken: string;
  expiresAt: number;
}

// ========== Credentials Storage ==========
export const saveCredentials = async (credentials: StoredCredentials): Promise<void> => {
  try {
    await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error('Error saving credentials:', error);
    throw error;
  }
};

export const getCredentials = async (): Promise<StoredCredentials | null> => {
  try {
    const data = await SecureStore.getItemAsync(CREDENTIALS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting credentials:', error);
    return null;
  }
};

export const deleteCredentials = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
  } catch (error) {
    console.error('Error deleting credentials:', error);
  }
};

// ========== Session Storage ==========
export const saveSession = async (session: StoredSession): Promise<void> => {
  try {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

export const getSession = async (): Promise<StoredSession | null> => {
  try {
    const data = await SecureStore.getItemAsync(SESSION_KEY);
    if (!data) return null;

    const session: StoredSession = JSON.parse(data);

    // Check if session expired
    if (session.expiresAt < Date.now()) {
      await deleteSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

export const deleteSession = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch (error) {
    console.error('Error deleting session:', error);
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const hashed = await hashPassword(password);
  return hashed === hash;
};