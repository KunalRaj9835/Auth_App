import React, { useState, useEffect } from 'react';
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


type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  const { login, isLoading, isLockedOut, getLockoutTimeRemaining, attemptsRemaining } = useAuth();

  useEffect(() => {
    if (isLockedOut) {
      const interval = setInterval(() => {
        const remaining = getLockoutTimeRemaining();
        setLockoutTime(remaining);
        if (remaining <= 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isLockedOut]);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Email validation
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address (e.g., example@domain.com)');
      return;
    }

    try {
      await login(email, password);
      // Navigation will happen automatically via RootNavigator when isAuthenticated changes
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An error occurred during login';
      Alert.alert('Login Failed', errorMsg);
    }
  };

  const formatLockoutTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Welcome back! Please login to continue.</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLockedOut && !isLoading}
              />
            </View>
            {email.length > 0 && !validateEmail(email) && (
              <Text style={styles.validationText}>
                Please enter a valid email (e.g., user@example.com)
              </Text>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLockedOut && !isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Lockout Warning */}
            {isLockedOut && (
              <View style={styles.warningContainer}>
                <Ionicons name="warning" size={20} color="#ff6b6b" />
                <Text style={styles.warningText}>
                  Account locked. Try again in {formatLockoutTime(lockoutTime)}
                </Text>
              </View>
            )}

            {/* Attempts Warning */}
            {!isLockedOut && attemptsRemaining < 5 && (
              <View style={styles.attemptsContainer}>
                <Text style={styles.attemptsText}>
                  {attemptsRemaining} attempt(s) remaining
                </Text>
              </View>
            )}

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, (isLockedOut || isLoading) && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLockedOut || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.linkText}>
                Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
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
    backgroundColor: '#ffffff', // pure white
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
    color: '#000', // black text
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 40,
  },
  form: {
    flex: 1,
  },

  // input box
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000', // black border
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: '#fff', // white inputs
  },
  inputIcon: {
    marginRight: 10,
    color: '#333',
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#000', // black text
  },

  validationText: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 5,
  },

  // lockout warning (minimal monochrome)
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  warningText: {
    color: '#000',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },

  // attempt counter box
  attemptsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  attemptsText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
  },

  // login button
  loginButton: {
    backgroundColor: '#fff', // white button
    borderWidth: 2,
    borderColor: '#000', // black border
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#000', // black text
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
    color: '#000', // black bold
    fontWeight: '700',
  },
});
