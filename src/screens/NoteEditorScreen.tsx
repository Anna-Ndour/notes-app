import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useNotes } from '../context/NotesContext';
import { useTheme } from '../theme/useTheme';

export const NoteEditorScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { noteId } = route.params || {};

  const { getNoteById, addNote, updateNote, deleteNote, toggleFavorite } = useNotes();
  const { theme } = useTheme();

  const existingNote = noteId ? getNoteById(noteId) : undefined;

  const [title, setTitle] = useState(existingNote?.title || '');
  const [body, setBody] = useState(existingNote?.body || '');
  const [isFavorite, setIsFavorite] = useState(existingNote?.isFavorite || false);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setBody(existingNote.body);
      setIsFavorite(existingNote.isFavorite);
    }
  }, [existingNote]);

  const handleSave = useCallback(async () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle && !trimmedBody) {
      navigation.goBack();
      return;
    }

    if (noteId) {
      await updateNote(noteId, trimmedTitle || 'Untitled Note', body);
    } else {
      await addNote(trimmedTitle || 'Untitled Note', body);
    }
    setHasChanged(false);
    navigation.goBack();
  }, [title, body, noteId, updateNote, addNote, navigation]);

  const handleDelete = () => {
    if (!noteId) {
      navigation.goBack();
      return;
    }

    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(noteId);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleToggleFavorite = async () => {
    if (noteId) {
      await toggleFavorite(noteId);
      setIsFavorite(!isFavorite);
    } else {
      setIsFavorite(!isFavorite);
      setHasChanged(true);
    }
  };

  const formattedDate = existingNote?.updatedAt
    ? new Date(existingNote.updatedAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {/* Top Custom Bar */}
      <View style={[styles.topBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => {
            if (hasChanged) {
              handleSave();
            } else {
              navigation.goBack();
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.accent} />
          <Text style={[styles.backText, { color: theme.accent }]}>Notes</Text>
        </TouchableOpacity>

        <View style={styles.topActions}>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={22}
              color={isFavorite ? theme.accent : theme.secondaryText}
            />
          </TouchableOpacity>

          {noteId ? (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.actionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={22} color={theme.destructive} />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={handleSave}
            style={[styles.doneButton, { backgroundColor: theme.accent }]}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Editor Body */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.editorScroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.dateText, { color: theme.secondaryText }]}>
            {formattedDate}
          </Text>

          {/* Title Input */}
          <TextInput
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setHasChanged(true);
            }}
            placeholder="Title"
            placeholderTextColor={theme.secondaryText}
            style={[styles.titleInput, { color: theme.text }]}
            multiline={false}
            returnKeyType="next"
          />

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Body Input */}
          <TextInput
            value={body}
            onChangeText={(text) => {
              setBody(text);
              setHasChanged(true);
            }}
            placeholder="Note text..."
            placeholderTextColor={theme.secondaryText}
            style={[styles.bodyInput, { color: theme.text }]}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 17,
    fontWeight: '400',
    marginLeft: -2,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionButton: {
    padding: 4,
  },
  doneButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  keyboardContainer: {
    flex: 1,
  },
  editorScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 60,
    flexGrow: 1,
  },
  dateText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 14,
    fontWeight: '500',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    paddingVertical: 4,
  },
  divider: {
    height: 0.5,
    marginBottom: 16,
  },
  bodyInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 250,
    paddingVertical: 0,
  },
});
