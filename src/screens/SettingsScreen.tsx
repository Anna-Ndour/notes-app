import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';

export const SettingsScreen: React.FC = () => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const { username, logout } = useAuth();
  const { importSampleNotes } = useNotes();

  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleImportSampleNotes = async () => {
    setIsImporting(true);
    setImportStatus(null);
    try {
      const count = await importSampleNotes();
      setImportStatus(`Successfully imported ${count} sample notes!`);
      Alert.alert('Import Complete', `Successfully imported ${count} sample notes from JSONPlaceholder.`);
    } catch (err: any) {
      const msg = err?.message || 'Failed to import sample notes.';
      setImportStatus(msg);
      Alert.alert('Import Failed', msg);
    } finally {
      setIsImporting(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Account Section */}
      <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
        ACCOUNT
      </Text>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor: '#3B82F6' }]}>
            <Ionicons name="person" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.rowTextContainer}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>Signed In As</Text>
            <Text style={[styles.rowSubLabel, { color: theme.secondaryText }]}>
              {username || 'emilys'}
            </Text>
          </View>
        </View>
      </View>

      {/* Appearance Section */}
      <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
        APPEARANCE
      </Text>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#6366F1' : '#F59E0B' }]}>
            <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={18} color="#FFFFFF" />
          </View>
          <View style={styles.rowTextContainer}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>Dark Mode</Text>
            <Text style={[styles.rowSubLabel, { color: theme.secondaryText }]}>
              {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D1D5DB', true: theme.accent }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Data & Actions Section */}
      <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
        DATA & SAMPLE CONTENT
      </Text>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity
          style={styles.clickableRow}
          onPress={handleImportSampleNotes}
          disabled={isImporting}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#10B981' }]}>
            <Ionicons name="cloud-download-outline" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.rowTextContainer}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>Import Sample Notes</Text>
            <Text style={[styles.rowSubLabel, { color: theme.secondaryText }]}>
              Fetch 5 posts from JSONPlaceholder
            </Text>
          </View>
          {isImporting ? (
            <ActivityIndicator size="small" color={theme.accent} />
          ) : (
            <Ionicons name="chevron-forward" size={18} color={theme.secondaryText} />
          )}
        </TouchableOpacity>

        {importStatus ? (
          <View style={[styles.statusBox, { borderTopColor: theme.border }]}>
            <Text style={[styles.statusText, { color: theme.secondaryText }]}>
              {importStatus}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Session Section */}
      <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
        SESSION
      </Text>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity
          style={styles.clickableRow}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.destructive }]}>
            <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.rowTextContainer}>
            <Text style={[styles.rowLabel, { color: theme.destructive }]}>Log Out</Text>
            <Text style={[styles.rowSubLabel, { color: theme.secondaryText }]}>
              Clears saved session token
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.secondaryText} />
        </TouchableOpacity>
      </View>

      {/* Midterm Info Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.secondaryText }]}>
          Notes App • University Midterm Mobile Dev
        </Text>
        <Text style={[styles.footerSubText, { color: theme.secondaryText }]}>
          Expo SDK 58 + SQLite + React Navigation
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 14,
    borderWidth: 0.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  clickableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowSubLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBox: {
    borderTopWidth: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statusText: {
    fontSize: 13,
  },
  footer: {
    marginTop: 36,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  footerSubText: {
    fontSize: 11,
    marginTop: 4,
  },
});
