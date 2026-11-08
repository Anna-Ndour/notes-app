import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/useTheme';

export const LoginScreen: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const { theme, isDarkMode } = useTheme();

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      return;
    }
    clearError();
    await login(username, password);
  };

  const handleFillDemo = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    clearError();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#292524' : '#FEF3C7' }]}>
              <Ionicons name="document-text" size={44} color={theme.accent} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Notes</Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              Sign in to access your notes
            </Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={[styles.errorCard, { backgroundColor: isDarkMode ? '#450a0a' : '#FEE2E2' }]}>
              <Ionicons name="alert-circle" size={20} color={theme.destructive} />
              <Text style={[styles.errorText, { color: theme.destructive }]}>{error}</Text>
            </View>
          ) : null}

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>Username</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
                <Ionicons name="person-outline" size={18} color={theme.secondaryText} style={styles.inputIcon} />
                <TextInput
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (error) clearError();
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="e.g. emilys"
                  placeholderTextColor={theme.secondaryText}
                  style={[styles.input, { color: theme.text }]}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>Password</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
                <Ionicons name="lock-closed-outline" size={18} color={theme.secondaryText} style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (error) clearError();
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholder="e.g. emilyspass"
                  placeholderTextColor={theme.secondaryText}
                  style={[styles.input, { color: theme.text }]}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: theme.accent },
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Log In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Demo helper */}
          <View style={styles.helperSection}>
            <Text style={[styles.helperTitle, { color: theme.secondaryText }]}>
              Midterm Test Credentials:
            </Text>
            <Text style={[styles.helperCreds, { color: theme.text }]}>
              User: <Text style={{ fontWeight: '600' }}>emilys</Text> • Pass: <Text style={{ fontWeight: '600' }}>emilyspass</Text>
            </Text>
            <TouchableOpacity onPress={handleFillDemo} style={styles.fillButton}>
              <Text style={[styles.fillButtonText, { color: theme.accent }]}>
                Auto-fill credentials
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 6,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  loginButton: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helperSection: {
    marginTop: 28,
    alignItems: 'center',
  },
  helperTitle: {
    fontSize: 13,
  },
  helperCreds: {
    fontSize: 14,
    marginTop: 4,
  },
  fillButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  fillButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
