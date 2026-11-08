import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootDrawerParamList, NotesTabParamList, RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/useTheme';

import { LoginScreen } from '../screens/LoginScreen';
import { AllNotesScreen } from '../screens/AllNotesScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { NoteEditorScreen } from '../screens/NoteEditorScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Tab = createBottomTabNavigator<NotesTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Bottom Tabs Navigator (inside the "Notes" section of the Drawer)
const NotesTabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.tabBarBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: theme.card,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerLeft: () => <DrawerToggleButton tintColor={theme.accent} />,
      }}
    >
      <Tab.Screen
        name="AllNotes"
        component={AllNotesScreen}
        options={{
          title: 'All Notes',
          tabBarLabel: 'All Notes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="documents-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Drawer Navigator
const MainDrawerNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="Notes"
      screenOptions={{
        drawerActiveTintColor: theme.accent,
        drawerInactiveTintColor: theme.secondaryText,
        drawerActiveBackgroundColor: theme.drawerActiveBackground,
        drawerStyle: {
          backgroundColor: theme.drawerBackground,
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
          marginLeft: -10,
        },
        headerStyle: {
          backgroundColor: theme.card,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Drawer.Screen
        name="Notes"
        component={NotesTabNavigator}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerLeft: () => <DrawerToggleButton tintColor={theme.accent} />,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// App Root Navigator handling Auth & Main flow
export const RootNavigator: React.FC = () => {
  const { token, isLoading } = useAuth();
  const { theme, isDarkMode } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      primary: theme.accent,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="DrawerRoot" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="DrawerRoot" component={MainDrawerNavigator} />
            <Stack.Screen
              name="NoteEditor"
              component={NoteEditorScreen}
              options={{
                animation: 'slide_from_bottom',
                presentation: 'card',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
