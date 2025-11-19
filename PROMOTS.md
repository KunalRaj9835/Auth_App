# AI Prompts Documentation

This file contains the key prompts used with AI tools during development. These can be reused or adapted for similar projects with different AI agents.

---

## Table of Contents
1. [Initial Project Setup](#initial-project-setup)
2. [Screen Component Generation](#screen-component-generation)
3. [Architecture & State Management](#architecture--state-management)
4. [Security & Storage](#security--storage)
5. [Validation & Forms](#validation--forms)
6. [Debugging & Error Fixes](#debugging--error-fixes)
7. [Testing Setup](#testing-setup)
8. [Documentation](#documentation)

---

## Initial Project Setup

### Prompt 1: Project Architecture Consultation
**Tool**: Claude  
**When**: Beginning of project

```
I need to build a React Native authentication app with the following requirements:
- User registration with email, password, name, phone
- Login with session management
- Profile screen
- Local secure credential storage
- Session persistence across app restarts
- Account lockout after 5 failed attempts


Tech stack I'm considering:
- React Native with Expo
- TypeScript
- Redux vs Context API (unsure)
- React Hook Form vs Formik (unsure)

Questions:
1. What state management approach would you recommend and why?
2. Best way to handle secure storage in React Native?
3. Recommended form library for this use case?
4. Best navigation structure for auth flows?
5. Testing strategy recommendations?

Please provide architectural recommendations with rationale.
```

**Output**: Received detailed architecture recommendations that shaped the project structure.

---

### Prompt 2: Package Selection
**Tool**: ChatGPT  
**When**: Project initialization

```
For a React Native Expo app with authentication, what packages should I install for:
1. Secure credential storage
2. Password hashing
3. Form validation
4. Phone number validation
5. State management (using Redux Toolkit)
6. Navigation
7. Biometric authentication

Please provide npm install commands with latest compatible versions for Expo SDK 49+.
```

**Output**: Package recommendations that formed the dependencies list.

---

## Screen Component Generation

### Prompt 3: SignUp Screen (Main Component)
**Tool**: Claude  
**When**: UI development phase

```
Create a complete React Native SignUp screen component with the following specifications:

REQUIREMENTS:
- TypeScript
- React Hook Form with Yup validation
- Fields: email, password, confirmPassword, firstName, lastName, phoneNumber
- Gradient background (dark theme, modern aesthetic)
- Inline error messages below each field
- Submit button disabled until form is valid
- Accessibility labels for screen readers
- Smooth keyboard handling (KeyboardAvoidingView)
- Loading state during submission
- Success/error toast messages

VALIDATION RULES:
- Email: valid format, required
- Password: min 8 chars, must contain uppercase, lowercase, number, special char
- Confirm Password: must match password
- First/Last Name: 2-50 characters, required
- Phone: valid international format, required

STYLING:
- Modern, polished UI
- Gradient background (dark blues/purples)
- Rounded input fields with subtle borders
- Smooth animations on error states
- Responsive design

INTEGRATION:
- Use a custom useAuth hook for registration (I'll provide this)
- Navigate to Home on success
- Show errors via Toast

Please provide the complete component code with proper TypeScript types.
```

**Output**: Complete `SignUpScreen.tsx` (~400 lines) - required minor modifications for Redux integration.

---

### Prompt 4: Login Screen
**Tool**: Claude  
**When**: After SignUp screen

```
Create a React Native Login screen similar to the SignUp screen you just created, but simpler:

FIELDS:
- Email
- Password

FEATURES:
- Same gradient background and styling as SignUp
- React Hook Form with Yup validation
- Show lockout message if user has too many failed attempts
- Biometric authentication button (optional, if supported)
- "Don't have an account? Sign up" link
- Remember the visual style from SignUp screen

Use the same tech stack and styling patterns. Make it consistent with SignUpScreen.
```

**Output**: Complete `LoginScreen.tsx` (~300 lines).

---

### Prompt 5: Home/Profile Screen
**Tool**: Claude  
**When**: After auth screens

```
Create a React Native Home/Profile screen that displays user information:

DISPLAY:
- User's email, first name, last name, phone (from Redux state)
- Greeting: "Welcome, [FirstName]!"
- Profile card with gradient background

FEATURES:
- Logout button (clear session and navigate to Welcome)
- Delete Account button (with confirmation alert)
- Biometric toggle (enable/disable biometric login)
- Visual stats or gamification elements (e.g., "Account created X days ago")

STYLING:
- Consistent with other screens (gradient background)
- Card layout for user info
- Modern, polished design
- Accessibility support

INTEGRATION:
- Read user from Redux state (useAppSelector)
- Use useAuth hook for logout and deleteAccount
- Navigate to Welcome on logout

Provide complete TypeScript component.
```

**Output**: Complete `HomeScreen.tsx` (~350 lines) - added stats and gamification elements.

---

### Prompt 6: Welcome Screen
**Tool**: Claude  
**When**: Navigation setup

```
Create a simple React Native Welcome/Landing screen:

ELEMENTS:
- App logo or title
- Tagline: "Secure Authentication Made Simple"
- Two buttons: "Sign Up" and "Login"
- Gradient background matching other screens

STYLING:
- Minimal, clean design
- Large, prominent buttons
- Smooth animations (fade-in on mount)

Keep it simple and consistent with the app's visual style.
```

**Output**: Complete `WelcomeScreen.tsx` (~150 lines).

---

## Architecture & State Management

### Prompt 7: Redux Setup
**Tool**: Claude  
**When**: State management phase

```
I need Redux Toolkit setup for authentication state. Here's what I need to track:

STATE:
- user: User object (id, email, firstName, lastName, phoneNumber) or null
- session: session token string or null
- isAuthenticated: boolean
- isLoading: boolean
- failedAttempts: number (for lockout)
- isLockedOut: boolean
- lockoutUntil: timestamp or null

ACTIONS:
- loginSuccess: set user and session
- logout: clear all state
- restoreSession: restore from storage
- incrementFailedAttempts: track failed logins
- checkLockoutExpiry: clear lockout if expired

Please provide:
1. Redux store setup (configureStore)
2. authSlice with all reducers
3. Typed hooks (useAppDispatch, useAppSelector)
4. TypeScript types

Use Redux Toolkit best practices.
```

**Output**: Complete Redux setup with typed hooks.

---

### Prompt 8: Navigation Structure
**Tool**: ChatGPT  
**When**: Navigation setup

```
How should I structure React Navigation for an auth flow?

Requirements:
- If NOT authenticated: show Welcome, Login, SignUp screens
- If authenticated: show Home screen
- Automatically handle session restoration
- No manual navigation needed when auth state changes

Should I use:
1. Two separate navigators (auth stack and main stack)?
2. Conditional rendering in one navigator?
3. Something else?

Provide example code with React Navigation v6+.
```

**Output**: Recommended conditional navigation approach (implemented in `RootNavigator.tsx`).

---

## Security & Storage

### Prompt 9: Secure Storage Implementation
**Tool**: Claude  
**When**: Security implementation

```
I need to implement secure credential storage in React Native using Expo SecureStore:

REQUIREMENTS:
1. Function to save credentials (email + hashed password)
2. Function to retrieve credentials
3. Function to save session (user object + token + expiry)
4. Function to retrieve session
5. Function to delete credentials
6. Function to delete session
7. Password hashing function (SHA-256)
8. Password verification function

SECURITY:
- Never store plaintext passwords
- Use Expo SecureStore (not AsyncStorage)
- Include error handling
- Add TypeScript types

Create a utility file called secureStorage.ts with all these functions.
```

**Output**: Complete `secureStorage.ts` implementation.

---

### Prompt 10: Lockout Mechanism
**Tool**: ChatGPT  
**When**: Security features

```
How do I implement account lockout after 5 failed login attempts in React Native with Redux?

Requirements:
- Track failed attempts in Redux state
- After 5 failures, lock account for 5 minutes
- Show countdown to user
- Automatically unlock after time expires
- Clear attempts on successful login

Provide Redux reducer logic and React hook code.
```

**Output**: Lockout logic (integrated into `authSlice.ts` and `useAuth.ts`).

---

## Validation & Forms

### Prompt 11: Yup Validation Schema
**Tool**: Claude  
**When**: Form validation setup

```
Create a Yup validation schema for user registration with these rules:

EMAIL:
- Required
- Valid email format

PASSWORD:
- Required
- Minimum 8 characters
- Must contain: uppercase, lowercase, number, special character (!@#$%^&*)

CONFIRM PASSWORD:
- Required
- Must match password field

FIRST NAME:
- Required
- 2-50 characters

LAST NAME:
- Required
- 2-50 characters

PHONE NUMBER:
- Required
- Valid international phone format
- Use libphonenumber-js for validation

Provide complete Yup schema with error messages. Also create a separate login schema (just email and password).
```

**Output**: Complete validation schemas in `registrationSchema.ts`.

---

### Prompt 12: React Hook Form Integration
**Tool**: ChatGPT  
**When**: Form setup

```
How do I integrate React Hook Form with Yup validation in a React Native component?

Show me:
1. How to set up the form with useForm
2. How to register fields
3. How to display error messages
4. How to disable submit button until valid
5. How to handle submission

Provide TypeScript example with a registration form.
```

**Output**: React Hook Form patterns (implemented in screen components).

---

## Debugging & Error Fixes

### Prompt 13: SecureStore Error
**Tool**: VS Code AI  
**When**: Runtime error encountered

```
Error: Encountered an exception while calling native method:
Exception 'No activity' in SecureStore.setItemAsync

What does this mean and how do I fix it in React Native?
```

**Output**: Explanation about Android activity lifecycle and proper initialization.

---

### Prompt 14: Redux Type Error
**Tool**: VS Code AI  
**When**: TypeScript error

```
Error in useAuth.ts:
Type 'User | null' is not assignable to type 'UserProfile'

Code:
const user = useAppSelector(state => state.auth.user);

How do I properly handle nullable user types with Redux in TypeScript?
```

**Output**: Type guard suggestions and proper null checking.

---

### Prompt 15: Navigation Error
**Tool**: ChatGPT  
**When**: Navigation not working

```
React Navigation error: "The action 'NAVIGATE' with payload {name: 'Home'} was not handled by any navigator."

My setup:
- Stack navigator with conditional rendering based on isAuthenticated
- Trying to navigate after successful login

Why isn't this working?
```

**Output**: Explanation of navigation state reset and proper navigation after auth state changes.

---

## Testing Setup

### Prompt 16: Jest Configuration
**Tool**: Claude  
**When**: Testing setup

```
Set up Jest for React Native with Expo SDK 49+:

Requirements:
- Test TypeScript files
- Test React components
- Mock React Native modules
- Generate coverage reports

Provide:
1. jest.config.js
2. jest.setup.js
3. package.json test scripts
4. Example test for a validation schema

Use Testing Library best practices.
```

**Output**: Complete Jest configuration files.

---

### Prompt 17: Auth Logic Tests
**Tool**: Claude  
**When**: Writing tests

```
Create unit tests for authentication logic:

TEST CASES:
1. Password hashing produces consistent output
2. Password verification works correctly
3. Session token generation is unique
4. Failed login attempts increment correctly
5. Lockout triggers after 5 attempts

Use Jest with proper mocks for SecureStore and Supabase.
Provide complete test file.
```

**Output**: Test template (heavily modified manually).

---

## Documentation

### Prompt 18: README Structure
**Tool**: ChatGPT  
**When**: Documentation phase

```
I need to create a comprehensive README for a React Native authentication app test project.

Include sections for:
- Overview & features
- Tech stack
- Installation steps
- Running the app
- Testing
- Architecture explanation
- Security approach
- Validation rules
- Trade-offs and design decisions
- Troubleshooting
- Future enhancements

Provide a detailed outline with what to include in each section.
```

**Output**: README structure (heavily expanded and edited).

---

### Prompt 19: AI Tools Documentation
**Tool**: Claude  
**When**: Final documentation

```
I need to document all AI tools used in this project for transparency.

Create an AI-TOOLS.md file structure that covers:
- Which AI tools I used (Claude, VS Code AI, ChatGPT)
- Why I chose each tool
- Specific use cases for each
- What percentage of code was AI-generated vs manual
- Time saved estimates
- Quality assessment
- Lessons learned
- Recommendations for others

Make it detailed and honest about both successes and failures.
```

**Output**: AI-TOOLS.md template (this file).

---

## Tips for Using These Prompts

### Prompt Engineering Best Practices

1. **Be Specific About Requirements**
   - List all features needed
   - Specify tech stack
   - Include validation rules
   - Mention styling preferences

2. **Provide Context**
   - Reference previous responses
   - Explain how code will integrate
   - Mention constraints

3. **Request Complete Code**
   - Ask for "complete" or "full" implementation
   - Specify "with TypeScript types"
   - Request "production-ready" code

4. **Iterate**
   - Start broad, then refine
   - Ask follow-up questions
   - Request modifications as needed

5. **Verify Output**
   - Always review generated code
   - Test thoroughly
   - Understand before implementing

---

## Prompt Templates for Similar Projects

### Template 1: Screen Component Generation
```
Create a [SCREEN_TYPE] screen component in React Native with:

TECH STACK:
- TypeScript
- [FORM_LIBRARY]
- [VALIDATION_LIBRARY]
- [STATE_MANAGEMENT]

FEATURES:
- [FEATURE_1]
- [FEATURE_2]
- [FEATURE_3]

FIELDS:
- [FIELD_1]: [VALIDATION_RULES]
- [FIELD_2]: [VALIDATION_RULES]

STYLING:
- [STYLE_REQUIREMENTS]
- [THEME_DESCRIPTION]

INTEGRATION:
- [HOW_IT_CONNECTS_TO_APP]

Provide complete TypeScript component with proper types.
```

---

### Template 2: Utility Function Creation
```
Create a utility function in TypeScript that:

PURPOSE: [WHAT_IT_DOES]

INPUTS:
- [PARAM_1]: [TYPE] - [DESCRIPTION]
- [PARAM_2]: [TYPE] - [DESCRIPTION]

OUTPUTS:
- Returns: [TYPE] - [DESCRIPTION]

ERROR HANDLING:
- [ERROR_CASE_1]
- [ERROR_CASE_2]

EXAMPLE USAGE:
[CODE_EXAMPLE]

Include proper TypeScript types and JSDoc comments.
```

---

### Template 3: Debugging Assistant
```
I'm getting this error in [FILE_NAME]:

ERROR MESSAGE:
[PASTE_ERROR]

RELEVANT CODE:
[PASTE_CODE]

CONTEXT:
- Using [TECH_STACK]
- Trying to [WHAT_YOU'RE_DOING]
- This happens when [TRIGGER]

What's causing this and how do I fix it?
```

---

### Template 4: Architecture Consultation
```
I need architectural advice for [PROJECT_TYPE]:

REQUIREMENTS:
- [REQUIREMENT_1]
- [REQUIREMENT_2]
- [REQUIREMENT_3]

CURRENT APPROACH:
[DESCRIBE_CURRENT_THINKING]

QUESTIONS:
1. [SPECIFIC_QUESTION_1]
2. [SPECIFIC_QUESTION_2]
3. [SPECIFIC_QUESTION_3]

Please provide recommendations with rationale and trade-offs.
```

---

*This file serves as a reference for reproducing this project with different AI agents or for similar future projects.*