import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';


type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, isLoading } = useAuth();

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation function
  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const minLength = password.length >= 8;

    if (!minLength) {
      return { isValid: false, message: 'Password must be at least 8 characters' };
    }
    if (!hasUpperCase) {
      return { isValid: false, message: 'Password must contain at least 1 uppercase letter' };
    }
    if (!hasLowerCase) {
      return { isValid: false, message: 'Password must contain at least 1 lowercase letter' };
    }
    if (!hasNumber) {
      return { isValid: false, message: 'Password must contain at least 1 number' };
    }
    if (!hasSpecialChar) {
      return { isValid: false, message: 'Password must contain at least 1 special character' };
    }

    return { isValid: true, message: 'Password is strong' };
  };

  // Phone number validation function
  const validatePhoneNumber = (phone: string): boolean => {
    // Remove any non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const handleSignUp = async () => {
    // Validation
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address (e.g., example@domain.com)');
      return;
    }

    // Password validation
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      Alert.alert('Weak Password', passwordCheck.message);
      return;
    }

    // Phone number validation (only if provided)
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Phone number must be exactly 10 digits');
      return;
    }

    try {
      await register({ email, firstName, lastName, phoneNumber } as any, password);
      Alert.alert('Success', 'Account created successfully');

      // If register logs the user in:
      navigation.replace('Home');

      // If register does NOT log in user:
      // navigation.replace('Login');
    } catch (error) {
      Alert.alert('Sign Up Failed', error instanceof Error ? error.message : 'An error occurred');
    }
  };

  // Get password strength indicator
  const getPasswordStrength = (): string => {
    if (!password) return '';
    const passwordCheck = validatePassword(password);
    if (passwordCheck.isValid) return '✓ Strong password';
    return passwordCheck.message;
  };

  const getPasswordStrengthColor = (): string => {
    if (!password) return '#999';
    const passwordCheck = validatePassword(password);
    return passwordCheck.isValid ? '#4caf50' : '#ff6b6b';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create an account to get started.</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First Name *"
                value={firstName}
                onChangeText={setFirstName}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Last Name *"
                value={lastName}
                onChangeText={setLastName}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email *"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {email.length > 0 && !validateEmail(email) && (
              <Text style={styles.validationText}>
                Please enter a valid email (e.g., user@example.com)
              </Text>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number (10 digits)"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                editable={!isLoading}
                maxLength={10}
              />
            </View>
            {phoneNumber.length > 0 && !validatePhoneNumber(phoneNumber) && (
              <Text style={styles.validationText}>
                Phone number must be exactly 10 digits
              </Text>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password *"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {password.length > 0 && (
              <Text style={[styles.passwordStrength, { color: getPasswordStrengthColor() }]}>
                {getPasswordStrength()}
              </Text>
            )}
            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Password must contain:</Text>
              <Text style={styles.requirementItem}>• At least 8 characters</Text>
              <Text style={styles.requirementItem}>• 1 uppercase letter (A-Z)</Text>
              <Text style={styles.requirementItem}>• 1 lowercase letter (a-z)</Text>
              <Text style={styles.requirementItem}>• 1 number (0-9)</Text>
              <Text style={styles.requirementItem}>• 1 special character (!@#$%^&*)</Text>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkTextBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Pure white
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000', // Black title
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#333', // Dark gray subtitle
    marginBottom: 40,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000', // Black border
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#fff', // Pure white inputs
  },
  inputIcon: {
    marginRight: 10,
    color: '#333',
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#000', // Black text
  },
  validationText: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 5,
  },
  passwordStrength: {
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 5,
    fontWeight: '500',
  },

  // Requirements box simplified to match the theme
  passwordRequirements: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  requirementItem: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },

  // SIGN UP button (white + black border)
  signUpButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonDisabled: {
    opacity: 0.5,
  },
  signUpButtonText: {
    color: '#000', // Black text
    fontSize: 18,
    fontWeight: '600',
  },

  linkText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#333',
  },
  linkTextBold: {
    color: '#000', // Black bold text
    fontWeight: '700',
  },
});
