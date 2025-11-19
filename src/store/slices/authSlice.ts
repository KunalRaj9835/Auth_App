import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, AuthState } from '../../types';

export interface User extends UserProfile {}

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  failedAttempts: 0,
  isLockedOut: false,
  lockoutUntil: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setAuth: (state, action: PayloadAction<{ user: UserProfile; session: any }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = true;
      state.failedAttempts = 0;
      state.isLockedOut = false;
      state.lockoutUntil = null;
    },
    
    clearAuth: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
    },

    loginSuccess: (state, action: PayloadAction<{ user: User; sessionToken: string }>) => {
      state.user = action.payload.user;
      state.session = action.payload.sessionToken;
      state.isAuthenticated = true;
      state.failedAttempts = 0;
      state.isLockedOut = false;
      state.lockoutUntil = null;
    },

    logout: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
    },

    restoreSession: (state, action: PayloadAction<{ user: User; sessionToken: string }>) => {
      state.user = action.payload.user;
      state.session = action.payload.sessionToken;
      state.isAuthenticated = true;
    },
    
    incrementFailedAttempts: (state) => {
      state.failedAttempts += 1;
      if (state.failedAttempts >= 5) {
        state.isLockedOut = true;
        state.lockoutUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
      }
    },
    
    clearLockout: (state) => {
      state.isLockedOut = false;
      state.lockoutUntil = null;
      state.failedAttempts = 0;
    },
    
    checkLockoutExpiry: (state) => {
      if (state.lockoutUntil && Date.now() >= state.lockoutUntil) {
        state.isLockedOut = false;
        state.lockoutUntil = null;
        state.failedAttempts = 0;
      }
    },
  },
});

export const {
  setLoading,
  setAuth,
  loginSuccess,
  clearAuth,
  logout,
  restoreSession,
  incrementFailedAttempts,
  clearLockout,
  checkLockoutExpiry,
} = authSlice.actions;

export default authSlice.reducer;