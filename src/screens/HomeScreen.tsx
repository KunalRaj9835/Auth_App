import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

interface UserData {
  id: string;
  user_id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
      } else if (profileData) {
        setProfile(profileData);
      } else {
        await createProfile();
      }

      const { data: userDataList, error: userDataError } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (userDataError) {
        console.error('User data error:', userDataError);
      } else {
        setUserData(userDataList || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try { await logout(); }
            catch { Alert.alert('Error', 'Failed to logout'); }
          },
        },
      ]
    );
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? '#00ff00' : '#667eea'} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading your data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeText, { color: theme.secondaryText }]}>Welcome back!</Text>
            <Text style={[styles.nameText, { color: theme.text }]}>
              {profile?.first_name || user?.first_name || 'User'}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.logoutButton,
              { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }
            ]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#ff6b6b" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }
          ]}
        >
          <View
            style={[
              styles.cardHeader,
              { borderBottomColor: theme.borderColor }
            ]}
          >
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="person-circle-outline" size={24} color={theme.primary} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>Profile Information</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.darkModeButton,
                { backgroundColor: theme.background, borderColor: theme.borderColor }
              ]}
              onPress={toggleDarkMode}
            >
              <Ionicons
                name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                size={20}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.cardContent}>
            <InfoRow icon="person-outline" label="Full Name" value={`${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'N/A'} theme={theme} />
            <InfoRow icon="mail-outline" label="Email" value={profile?.email || user?.email || 'N/A'} theme={theme} />
            <InfoRow icon="call-outline" label="Phone" value={profile?.phone_number || 'N/A'} theme={theme} />
            <InfoRow icon="calendar-outline" label="Member Since" value={profile?.created_at ? formatDate(profile.created_at) : 'N/A'} theme={theme} />
          </View>
        </View>

        {/* User Data Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }
          ]}
        >
          <View
            style={[
              styles.cardHeader,
              { borderBottomColor: theme.borderColor }
            ]}
          >
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="server-outline" size={24} color={theme.primary} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>User Data</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            {userData.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.secondaryText }]}>No additional data stored</Text>
            ) : (
              userData.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.dataItem,
                    {
                      backgroundColor: theme.dataItemBackground,
                      borderColor: theme.borderColor,
                      borderLeftColor: theme.primary
                    }
                  ]}
                >
                  <Text style={[styles.dataKey, { color: theme.text }]}>{item.key}</Text>
                  <Text style={[styles.dataValue, { color: theme.secondaryText }]}>
                    {JSON.stringify(item.value, null, 2)}
                  </Text>
                  <Text style={[styles.dataDate, { color: theme.tertiaryText }]}>
                    Updated: {formatDate(item.updated_at)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
}

const lightTheme = {
  background: '#ffffff',
  cardBackground: '#ffffff',
  text: '#000000',
  secondaryText: '#333333',
  tertiaryText: '#555555',
  primary: '#000000',
  dataItemBackground: '#ffffff',
  borderColor: '#000000',
};

const darkTheme = {
  background: '#000000',
  cardBackground: '#000000',
  text: '#ffffff',
  secondaryText: '#cccccc',
  tertiaryText: '#aaaaaa',
  primary: '#ffffff',
  dataItemBackground: '#000000',
  borderColor: '#ffffff',
};

const InfoRow = ({ icon, label, value, theme }: any) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabel}>
      <Ionicons name={icon} size={18} color={theme.secondaryText} />
      <Text style={[styles.infoLabelText, { color: theme.secondaryText }]}>{label}</Text>
    </View>
    <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
  </View>
);


const styles = StyleSheet.create({
  container: { flex: 1 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  loadingText: { marginTop: 16, fontSize: 16 },

  scrollContent: { padding: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  welcomeText: { fontSize: 16, marginBottom: 4 },

  nameText: { fontSize: 28, fontWeight: 'bold' },

  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
  },

  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center' },

  cardTitle: { fontSize: 18, fontWeight: '700', marginLeft: 8 },

  darkModeButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },

  cardContent: { gap: 12 },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },

  infoLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  infoLabelText: { fontSize: 14, fontWeight: '500' },

  infoValue: { fontSize: 14, fontWeight: '600', textAlign: 'right' },

  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },

  dataItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 8,
  },

  dataKey: { fontSize: 14, fontWeight: '700', marginBottom: 4 },

  dataValue: { fontSize: 12, fontFamily: 'monospace', marginBottom: 4 },

  dataDate: { fontSize: 11, fontStyle: 'italic' },

  
});
