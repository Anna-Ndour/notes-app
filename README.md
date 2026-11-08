# NotesApp

A simple iPhone-style Notes application built for a university midterm project.

## Features
- **Navigation**: Drawer menu with "Notes" and "Settings", plus Bottom Tabs for "All Notes" and "Favorites".
- **Notes CRUD**: Create, view, edit, and delete notes with title, body, and timestamp preview.
- **Favorites**: Toggle notes as favorites and view them in the dedicated Favorites tab.
- **Local Storage**: Notes persisted in SQLite (`expo-sqlite`), theme preference in AsyncStorage, and auth token in SecureStore.
- **Backend API Integration**: DummyJSON authentication and JSONPlaceholder sample notes import.
- **Light & Dark Theme**: Full theme support across screens, drawer, and tab bar.
- **Clean iOS Aesthetic**: Yellow accent, list cards, and floating "+" button.

## Tech Stack
- React Native
- TypeScript
- Expo (SDK 58)
- React Navigation (Drawer, Bottom Tabs, Native Stack)
- SQLite (`expo-sqlite`)
- AsyncStorage (`@react-native-async-storage/async-storage`)
- SecureStore (`expo-secure-store`)

## How to Run
```bash
# 1. Install dependencies
npm install

# 2. Start the Expo development server
npx expo start
```

## Test Login Credentials
- **Username**: `emilys`
- **Password**: `emilyspass`
