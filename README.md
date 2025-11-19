# Simple-Test: React Native Authentication App

A secure, production-ready React Native authentication application built with TypeScript, featuring user registration, login, session management, and biometric authentication capabilities.

##  Live Demo

**Expo Go**: Scan the QR code when running `npm start` to test on your device via Expo Go app

**APK Download**: Coming soon - Android APK build will be available for testing

**Note**: For the best experience, use Expo Go on a physical device as some features (like biometric authentication and SecureStore) have limited functionality in simulators.

---

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Architecture](#architecture)
- [Security Approach](#security-approach)
- [Validation Rules](#validation-rules)
- [Trade-offs & Design Decisions](#trade-offs--design-decisions)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting](#troubleshooting)

---

##  Overview

This project replicates a secure account setup experience with registration, login, and profile management. Built as a local-only application (no external API calls required for basic functionality), it demonstrates best practices in mobile authentication, state management, and secure data storage.

The app uses **Supabase** as an optional backend for profile persistence across devices, while maintaining full offline capability through local secure storage.

---

##  Features

### Core Features
-  **User Registration** - Complete signup flow with comprehensive validation
-  **Secure Login** - Email/password authentication with session management
-  **Profile Management** - View and manage user information
-  **Session Persistence** - Seamless experience across app restarts (30-day sessions)
-  **Account Lockout** - Security lockout after 5 failed login attempts (5-minute cooldown)
-  **Form State Persistence** - Registration data saved during form filling

### UI/UI Features
-  **Modern, Polished Interface** - Gradient backgrounds, smooth animations
-  **Dark Mode Ready** - Designed with dark theme aesthetics
-  **Accessibility** - Screen reader support, proper labels, sufficient contrast
-  **Responsive Keyboard Handling** - Smooth UX on all screen sizes
-  **Toast Notifications** - Clear feedback for all user actions

**Note**: While section headers use icons for visual organization in documentation, the actual app UI does not use emojis - maintaining a clean, professional interface throughout.

### Security Features
-  **Secure Credential Storage** - Expo SecureStore (Keychain/Keystore)
-  **Password Hashing** - SHA-256 hashing before storage
-  **No Plaintext Passwords** - Never stored in readable format
-  **Session Token Management** - Unique tokens with expiration
-  **Brute Force Protection** - Account lockout mechanism
-  **Secure Data Deletion** - Complete cleanup on logout/account deletion

---

##  Technology Stack

### Core Technologies
- **React Native** `0.81.5` - Mobile framework
- **Expo** `~54.0.24` - Development platform
- **TypeScript** `~5.9.2` - Type safety

### State Management
- **Redux Toolkit** `^2.10.1` - Global state management
- **React Redux** `^9.2.0` - React bindings for Redux

### Navigation
- **React Navigation** `^7.1.20` - Navigation library
- **Native Stack Navigator** `^7.6.3` - Native navigation performance

### Form Management & Validation
- **React Hook Form** `^7.66.1` - Performant form handling
- **Yup** `^1.7.1` - Schema validation
- **@hookform/resolvers** `^5.2.2` - Yup integration with React Hook Form

### Backend & Storage
- **Supabase** `^2.83.0` - PostgreSQL database and authentication backend
- **Expo SecureStore** `~15.0.7` - Encrypted credential storage
- **AsyncStorage** `2.2.0` - Form draft persistence
- **Expo Crypto** `^15.0.7` - Password hashing

### Biometric Authentication
- **Expo Local Authentication** `~17.0.7` - Face ID/Touch ID support

### UI Components & Styling
- **Expo Linear Gradient** `~15.0.7` - Gradient backgrounds
- **Expo Blur** `~15.0.7` - Blur effects
- **React Native Gesture Handler** `^2.29.1` - Enhanced touch interactions
- **React Native Toast Message** `^2.3.3` - User feedback notifications

### Utilities
- **libphonenumber-js** `^1.12.26` - Phone number validation
- **i18n-iso-countries** `^7.14.0` - Country code handling
- **react-native-url-polyfill** `^3.0.0` - URL API polyfill

### Development Tools
- **Jest** `^30.2.0` - Testing framework
- **Testing Library** `^13.3.3` - Component testing utilities
- **ESLint** `^9.39.1` - Code linting
- **Prettier** `^3.6.2` - Code formatting
- **TypeScript ESLint** `^8.47.0` - TypeScript linting rules

---

## 📁 Project Structure

```
simple-test/
├── __tests__/                 # Test files
│   ├── auth.test.ts           # Authentication logic tests
│   └── registrationSchema.test.ts  # Validation schema tests
├── assets/                    # Static assets (images, fonts)
├── src/
│   ├── hooks/
│   │   └── useAuth.ts         # Authentication hook (backend logic)
│   ├── lib/
│   │   └── supabase.ts        # Supabase client configuration
│   ├── navigation/
│   │   └── RootNavigator.tsx  # App navigation structure
│   ├── screens/
│   │   ├── WelcomeScreen.tsx  # Landing screen
│   │   ├── SignUpScreen.tsx   # Registration screen
│   │   ├── LoginScreen.tsx    # Login screen
│   │   └── HomeScreen.tsx     # User profile/home screen
│   ├── store/
│   │   ├── index.ts           # Redux store configuration
│   │   ├── hooks.ts           # Typed Redux hooks
│   │   └── slices/
│   │       └── authSlice.ts   # Authentication state slice
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── utils/
│   │   └── secureStorage.ts   # Secure storage utilities
│   └── validation/
│       └── registrationSchema.ts  # Form validation schemas
├── App.tsx                    # App entry point
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── jest.config.js             # Jest configuration
├── .eslintrc.js               # ESLint configuration
├── .prettierrc                # Prettier configuration
└── .env                       # Environment variables (Supabase credentials)
```

---

##  Installation & Setup

### Prerequisites

- **Node.js** `16.x` or higher
- **npm** `7.x` or higher (or **yarn**)
- **Expo CLI** (installed globally): `npm install -g expo-cli`
- **iOS**: macOS with Xcode (for iOS development)
- **Android**: Android Studio with Android SDK (for Android development)
- **Expo Go app** on your mobile device (for testing)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd simple-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase (Optional)**
   
   The app works fully offline, but for cross-device profile sync, set up Supabase:

   a. Create a Supabase project at [supabase.com](https://supabase.com)
   
   b. Run the SQL schema (create the `profiles` table):
   ```sql
   -- Create profiles table with email as unique
   CREATE TABLE IF NOT EXISTS profiles (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id TEXT UNIQUE NOT NULL,
     email TEXT UNIQUE NOT NULL,
     first_name TEXT,
     last_name TEXT,
     phone_number TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Create indexes for faster lookups
   CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
   CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
   
   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
   -- Create policies
   CREATE POLICY "Users can view their own profile"
     ON profiles FOR SELECT
     USING (true);
   
   CREATE POLICY "Users can insert their own profile"
     ON profiles FOR INSERT
     WITH CHECK (true);
   
   CREATE POLICY "Users can update their own profile"
     ON profiles FOR UPDATE
     USING (true);
   ```

   c. Copy your Supabase credentials to `.env`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL="your-project-url"
   EXPO_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

4. **Verify installation**
   ```bash
   npm run type-check
   npm run lint
   npm test
   ```

---

## 🏃 Running the App

### Start Development Server
```bash
npm start
```

This opens the Expo DevTools in your browser. Use the QR code to run on your device via Expo Go.

### Platform-Specific Commands

**iOS Simulator** (macOS only):
```bash
npm run ios
```

**Android Emulator**:
```bash
npm run android
```


**Recommendation**: Use Expo Go on mobile for proper testing.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types |
| `npm run quality` | Run all checks (lint + types + tests) |

---

## 🧪 Testing

### Test Coverage

The app includes comprehensive unit tests for critical authentication logic:

#### Test Files
- **`__tests__/auth.test.ts`** - Authentication flow tests
- **`__tests__/registrationSchema.test.ts`** - Validation schema tests

#### Running Tests

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Results
```
Test Suites: 2 passed, 2 total
Tests:       3 passed, 3 total
```

### What's Tested
-  User registration validation
-  Login credential verification
-  Form validation rules (email, password, phone)
-  Yup schema validation

### What Could Be Added (Future)
- E2E tests with Detox
- Component integration tests
- Biometric authentication tests
- Session management tests
- Redux action/reducer tests

---

##  Architecture

### State Management Architecture

This app uses a **Redux-based architecture** where the `useAuth` hook serves as the "backend layer" - essentially replacing what would normally be API calls to a Node.js server.

#### Why This Approach?

In a typical production app, you'd have:
```
Mobile App → API Server (Node.js) → Database
```

To avoid a single point of failure and simplify deployment, this app uses:
```
Mobile App → useAuth Hook (business logic) → Supabase + SecureStore
```

**Benefits:**
- No separate backend server to maintain
- Direct database access through Supabase
- Local-first architecture with offline support
- Scalable (Supabase handles infrastructure)
- Reduced latency (fewer network hops)

#### Data Flow

```
┌─────────────────┐
│   UI Components │
│ (SignUp/Login)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   useAuth Hook  │ ← "Backend Logic Layer"
│  (Business Logic)│
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌──────────────┐
│  Redux  │ │ SecureStore  │
│  Store  │ │   (Local)    │
└─────────┘ └──────────────┘
    │              │
    └──────┬───────┘
           ▼
    ┌──────────────┐
    │   Supabase   │
    │  (Postgres)  │
    └──────────────┘
```

### Key Architectural Components

#### 1. **useAuth Hook** (`src/hooks/useAuth.ts`)
The "backend" of the app. Handles:
- User registration with duplicate email checking
- Login with credential verification
- Session creation and restoration
- Account lockout logic
- Password hashing
- Supabase synchronization

#### 2. **Redux Store** (`src/store/`)
Manages global authentication state:
- Current user information
- Session token
- Authentication status
- Failed login attempts
- Lockout state

#### 3. **Secure Storage** (`src/utils/secureStorage.ts`)
Handles all sensitive data operations:
- Password hashing (SHA-256)
- Credential storage (SecureStore)
- Session persistence
- Secure deletion

#### 4. **Navigation** (`src/navigation/RootNavigator.tsx`)
Conditional navigation based on auth state:
- Unauthenticated: Welcome → Login/SignUp
- Authenticated: Home Screen

#### 5. **Supabase Integration** (`src/lib/supabase.ts`)
Optional cloud sync:
- Profile storage in PostgreSQL
- Duplicate email detection
- Cross-device data availability

### Authentication Flow

#### Registration Flow
```
User fills form → Validation → Password hashing → 
Check Supabase for duplicate email → 
Save to local SecureStore → 
Create Supabase profile → 
Generate session → 
Update Redux state → 
Navigate to Home
```

#### Login Flow
```
User enters credentials → 
Retrieve stored hash from SecureStore → 
Verify password → 
Check lockout status → 
Fetch profile from Supabase → 
Create session → 
Update Redux → 
Navigate to Home
```

#### Session Restoration Flow
```
App launches → 
useAuth checks SecureStore for session → 
If valid session found → 
Restore Redux state → 
Navigate to Home
```

---

##  Security Approach

Security was a top priority in this application. Here's how sensitive data is protected:

### Password Security

1. **Never Stored in Plaintext**
   - All passwords are hashed using SHA-256 before storage
   - Original password is never saved anywhere

2. **Hashing Implementation**
   ```typescript
   // src/utils/secureStorage.ts
   export const hashPassword = async (password: string): Promise<string> => {
     const digest = await Crypto.digestStringAsync(
       Crypto.CryptoDigestAlgorithm.SHA256,
       password
     );
     return digest;
   };
   ```

3. **Password Requirements**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

### Credential Storage

**Expo SecureStore** is used for all sensitive data:
- **iOS**: Data stored in iOS Keychain (hardware-encrypted)
- **Android**: Data stored in Android Keystore (hardware-backed when available)
- **Automatic encryption** at rest
- **Isolated per app** - no cross-app access

### Session Management

1. **Session Tokens**
   - Unique, randomly generated tokens
   - 30-day expiration
   - Stored securely with credentials

2. **Session Restoration**
   - On app launch, checks for valid session
   - Expired sessions automatically cleared
   - Seamless re-authentication when needed

### Brute Force Protection

1. **Account Lockout**
   - 5 failed login attempts trigger lockout
   - 5-minute cooldown period
   - Clear error messages showing remaining attempts
   - Automatic lockout expiry

2. **Implementation**
   ```typescript
   // After 5 failed attempts:
   state.isLockedOut = true;
   state.lockoutUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
   ```

### Data Deletion

When user logs out or deletes account:
1.  All SecureStore data cleared
2.  Redux state reset
3.  Supabase profile deleted (if exists)
4.  Session token invalidated
5.  No recoverable data remains

### Security Best Practices Implemented

-  No credentials in source code
-  Environment variables for API keys (`.env`)
-  HTTPS-only communication (Supabase)
-  Input sanitization and validation
-  No console logging of sensitive data in production
-  Secure random token generation
-  Proper error handling without leaking info

### Known Security Limitations

1. **SHA-256 for Hashing**
   - Uses SHA-256 instead of bcrypt/scrypt
   - Trade-off: Limited crypto libraries in React Native
   - Acceptable for demo; production should use dedicated auth service

2. **Client-Side Validation Only**
   - All validation happens on client
   - Production should have server-side validation too

3. **Supabase Row-Level Security**
   - Currently allows public read/write
   - Should be locked down in production with proper policies

---

##  Validation Rules

Comprehensive validation is implemented using **Yup** schemas with **React Hook Form**.

### Registration Form Validation

#### Email
- **Required**: "Email is required"
- **Format**: Must be valid email format
- **Example**: `user@example.com`

#### Password
- **Required**: "Password is required"
- **Minimum Length**: 8 characters
- **Must Contain**:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (`!@#$%^&*`)
- **Error Message**: "Password must contain at least one uppercase, one lowercase, one number, and one special character"

#### Confirm Password
- **Required**: "Please confirm your password"
- **Must Match**: "Passwords must match"

#### First Name
- **Required**: "First name is required"
- **Minimum Length**: 2 characters
- **Maximum Length**: 50 characters

#### Last Name
- **Required**: "Last name is required"
- **Minimum Length**: 2 characters
- **Maximum Length**: 50 characters

#### Phone Number
- **Required**: "Phone number is required"
- **Format**: Basic phone number validation
- **Note**: Advanced international phone validation with `libphonenumber-js` is available in the codebase but not yet fully implemented

### Login Form Validation

#### Email
- **Required**: "Email is required"
- **Format**: Must be valid email

#### Password
- **Required**: "Password is required"

### Real-Time Validation

- **On Change**: Validates as user types (debounced)
- **On Blur**: Validates when user leaves field
- **On Submit**: Final validation before submission
- **Inline Errors**: Error messages appear below each field
- **Submit Button**: Disabled until all fields are valid

### Validation Schema Implementation

```typescript
// src/validation/registrationSchema.ts
import * as Yup from 'yup';

export const registrationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/[a-z]/, 'Must contain lowercase')
    .matches(/[0-9]/, 'Must contain number')
    .matches(/[!@#$%^&*]/, 'Must contain special character')
    .required('Password is required'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  
  firstName: Yup.string()
    .min(2, 'Too short')
    .max(50, 'Too long')
    .required('First name is required'),
  
  lastName: Yup.string()
    .min(2, 'Too short')
    .max(50, 'Too long')
    .required('Last name is required'),
  
  phoneNumber: Yup.string()
    .test('phone', 'Invalid phone number', (value) => {
      if (!value) return false;
      return isValidPhoneNumber(value);
    })
    .required('Phone number is required'),
});
```

---

## ⚖️ Trade-offs & Design Decisions

### 1. **Supabase vs. Pure Local Storage**

**Decision**: Use Supabase as optional backend

**Rationale**:
- Enables cross-device profile sync
- Demonstrates cloud integration skills
- Provides duplicate email detection
- Still works 100% offline for core features

**Trade-off**: Added complexity, external dependency

**Alternative Considered**: Pure AsyncStorage + SecureStore (simpler but no sync)

---

### 2. **Redux vs. Context API**

**Decision**: Redux Toolkit

**Rationale**:
- Better DevTools for debugging
- More structured state management
- Easier to scale and test
- Industry standard for larger apps

**Trade-off**: More boilerplate code

**Alternative Considered**: Context API (simpler for small apps)

---

### 3. **SHA-256 vs. bcrypt/scrypt**

**Decision**: SHA-256 (via Expo Crypto)

**Rationale**:
- Native Expo support (no additional native modules)
- Sufficient for demo/prototype
- Fast and lightweight

**Trade-off**: Less secure than modern password hashing algorithms

**Production Recommendation**: Use dedicated auth service (Firebase Auth, Auth0) or implement server-side bcrypt

---

### 4. **React Hook Form vs. Formik**

**Decision**: React Hook Form

**Rationale**:
- Better performance (fewer re-renders)
- Smaller bundle size
- Excellent TypeScript support
- Modern, actively maintained

**Trade-off**: Slightly steeper learning curve

---

### 5. **Form Draft Persistence**

**Decision**: Save registration state to AsyncStorage on every field change

**Rationale**:
- Meets requirement: "Persist partially filled registration state"
- Great UX - users don't lose progress
- Simple implementation

**Trade-off**: Slight performance overhead (mitigated with debouncing)

---

### 6. **Navigation Structure**

**Decision**: Conditional navigation based on auth state

**Rationale**:
- Clean separation between auth and main app
- No manual navigation needed
- Automatically handles session restore

**Trade-off**: More complex navigator logic

---

### 7. **Lockout Duration**

**Decision**: 5 minutes after 5 failed attempts

**Rationale**:
- Balances security and UX
- Industry standard
- Short enough to not frustrate legitimate users
- Long enough to deter brute force

**Alternative Considered**: Progressive lockout (1 min, 5 min, 30 min...)

---

### 8. **Testing Strategy**

**Decision**: Unit tests for validation and auth logic, no E2E tests

**Rationale**:
- Focuses on most critical code paths
- Fast to run and maintain
- Good coverage with minimal setup

**Trade-off**: No full user flow testing

**Future Enhancement**: Add Detox for E2E tests

---

### 9. **TypeScript Strictness**

**Decision**: Moderate strictness (13 `any` warnings allowed)

**Rationale**:
- Prioritized delivery speed
- All critical types are defined
- Warnings don't affect functionality

**Trade-off**: Not perfectly type-safe

**Current Status**: 
```
✖ 13 problems (0 errors, 13 warnings)
```

**Production Recommendation**: Eliminate all `any` types

---

### 10. **Biometric Auth as Optional**

**Decision**: Implemented but not enforced

**Rationale**:
- Not all devices support biometrics
- Users should opt-in
- Better UX to make it optional

**Trade-off**: Requires user to enable manually

---


##  Troubleshooting

### Common Issues

#### 1. **"Module not found" errors**

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start --clear
```

#### 2. **Supabase connection issues**

**Symptoms**: "Failed to create account" errors

**Solution**:
- Verify `.env` file exists with correct credentials
- Check Supabase project is active
- Ensure SQL schema has been run
- Check network connection

#### 3. **SecureStore errors on iOS Simulator**

**Symptoms**: "SecureStore is not available" warning

**Note**: This is expected behavior. SecureStore has limited functionality in iOS Simulator.

**Solution**: Test on a real device for full SecureStore functionality

#### 4. **TypeScript errors after updating**

**Solution**:
```bash
npm run type-check
# Fix any reported errors
```

#### 5. **Tests failing**

**Solution**:
```bash
# Clear Jest cache
npm test -- --clearCache
npm test
```

#### 6. **App stuck on splash screen**

**Cause**: Likely a JavaScript error

**Solution**:
1. Check Metro bundler console for errors
2. Reload the app: Shake device → Reload
3. Check `RootNavigator.tsx` loading logic

#### 7. **Lockout not expiring**

**Solution**: 
- Wait full 5 minutes
- Or manually clear app data:
  ```typescript
  // In development, you can reset via:
  import { deleteCredentials, deleteSession } from './utils/secureStorage';
  await deleteCredentials();
  await deleteSession();
  ```

#### 8. **Form not submitting**

**Check**:
1. All required fields filled?
2. Check console for validation errors
3. Submit button enabled?

**Debug**:
```typescript
// Add in your form component
console.log('Form errors:', formState.errors);
console.log('Form values:', getValues());
```

---

##  Known Issues

### Current Warnings
- 13 TypeScript `any` type warnings (non-blocking)
- ESLint `no-useless-escape` warning in regex (cosmetic)

### Limitations
1. **Supabase Dependency**: While app works offline, profile sync requires internet
2. **No Backend API**: Direct database access (acceptable for demo, not ideal for production)
3. **SHA-256 Hashing**: Less secure than bcrypt (see Security section)
4. **No Rate Limiting**: On Supabase requests (should be added for production)
5. **iOS Simulator Limitations**: SecureStore has reduced functionality

---

##  Additional Documentation

### Folder Details

```
src/
├── hooks/          # Custom React hooks (business logic)
├── lib/            # Third-party service initialization
├── navigation/     # Navigation configuration
├── screens/        # Screen components (page-level)
├── store/          # Redux state management
├── types/          # TypeScript type definitions
├── utils/          # Utility functions (storage, helpers)
└── validation/     # Form validation schemas
```

### Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useAuth.ts` | All authentication logic (registration, login, logout) |
| `src/store/slices/authSlice.ts` | Redux state for authentication |
| `src/utils/secureStorage.ts` | Secure credential storage functions |
| `src/validation/registrationSchema.ts` | Yup validation schemas |
| `src/screens/SignUpScreen.tsx` | Registration UI |
| `src/screens/LoginScreen.tsx` | Login UI |
| `src/screens/HomeScreen.tsx` | User profile UI |
| `.env` | Environment variables (not in git) |

---


##  License

This project was created as a test assignment. License TBD.

---

##  Author

**Your Name**  
Email: kunalraj3374@gmail.com
GitHub: kunalraj9845

---

##  Acknowledgments

- Reference design: [dev-cf.visageneral.com/register](https://dev-cf.visageneral.com/register)
- Expo documentation and community
- React Native community

---
