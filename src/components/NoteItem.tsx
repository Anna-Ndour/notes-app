import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '../types';
import { useTheme } from '../theme/useTheme';

interface NoteItemProps {
  note: Note;
  onPress: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}

export const formatNoteDate = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    if (isToday) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onPress,
  onToggleFavorite,
  onDelete,
}) => {
  const { theme } = useTheme();
  const dateStr = formatNoteDate(note.updatedAt || note.createdAt);
  const preview = note.body ? note.body.replace(/\n+/g, ' ').trim() : 'No additional text';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {note.title || 'Untitled Note'}
        </Text>
        <View style={styles.detailsRow}>
          <Text style={[styles.date, { color: theme.secondaryText }]}>{dateStr}</Text>
          <Text
            style={[styles.preview, { color: theme.secondaryText }]}
            numberOfLines={1}
          >
            {preview}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onToggleFavorite}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={note.isFavorite ? 'star' : 'star-outline'}
            size={20}
            color={note.isFavorite ? theme.accent : theme.secondaryText}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={19} color={theme.secondaryText} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderWidth: 0.5,
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 8,
  },
  preview: {
    fontSize: 13,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    padding: 6,
  },
});
