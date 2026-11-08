import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useNotes } from '../context/NotesContext';
import { useTheme } from '../theme/useTheme';
import { NoteItem } from '../components/NoteItem';
import { FloatingAddButton } from '../components/FloatingAddButton';

export const AllNotesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { notes, isLoading, deleteNote, toggleFavorite, refreshNotes } = useNotes();
  const { theme, isDarkMode } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [notes, searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshNotes();
    setIsRefreshing(false);
  };

  const handleOpenEditor = (noteId?: number) => {
    navigation.navigate('NoteEditor', { noteId });
  };

  const handleDelete = (id: number, title: string) => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete "${title || 'Untitled Note'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteNote(id),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.inputBackground }]}>
        <Ionicons name="search" size={17} color={theme.secondaryText} style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search notes..."
          placeholderTextColor={theme.secondaryText}
          style={[styles.searchInput, { color: theme.text }]}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={18}
            color={theme.secondaryText}
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>

      {/* Notes Count Info */}
      <View style={styles.headerInfo}>
        <Text style={[styles.countText, { color: theme.secondaryText }]}>
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
        </Text>
      </View>

      {/* Notes List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NoteItem
              note={item}
              onPress={() => handleOpenEditor(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onDelete={() => handleDelete(item.id, item.title)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: isDarkMode ? '#27272a' : '#f3f4f6' }]}>
                <Ionicons name="document-text-outline" size={48} color={theme.secondaryText} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {searchQuery ? 'No matching notes' : 'No notes yet'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.secondaryText }]}>
                {searchQuery
                  ? 'Try searching with different keywords'
                  : 'Tap the yellow + button below to create your first note.'}
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Add Button */}
      <FloatingAddButton onPress={() => handleOpenEditor()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  headerInfo: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingBottom: 90,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
