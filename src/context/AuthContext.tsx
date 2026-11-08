import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi } from '../api/authApi';

interface AuthContextType {
  token: string | null;
  username: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const TOKEN_KEY = 'notes_app_auth_token';
const USERNAME_KEY = 'notes_app_auth_username';

const setSecureItem = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    await AsyncStorage.setItem(key, value);
  }
};

const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    const val = await SecureStore.getItemAsync(key);
    if (val !== null) return val;
    return await AsyncStorage.getItem(key);
  } catch {
    return await AsyncStorage.getItem(key);
  }
};

const deleteSecureItem = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    await AsyncStorage.removeItem(key);
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const savedToken = await getSecureItem(TOKEN_KEY);
        const savedUsername = await getSecureItem(USERNAME_KEY);
        if (savedToken) {
          setToken(savedToken);
          setUsername(savedUsername || 'Emily');
        }
      } catch (err) {
        console.error('Error reading auth token:', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (user: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginApi(user, pass);
      await setSecureItem(TOKEN_KEY, result.token);
      await setSecureItem(USERNAME_KEY, result.username);
      setToken(result.token);
      setUsername(result.username);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await deleteSecureItem(TOKEN_KEY);
      await deleteSecureItem(USERNAME_KEY);
      setToken(null);
      setUsername(null);
      setError(null);
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
