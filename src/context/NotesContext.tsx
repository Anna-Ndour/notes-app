import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import {
  fetchNotesFromDb,
  insertNoteInDb,
  updateNoteInDb,
  deleteNoteFromDb,
  toggleFavoriteInDb,
  insertMultipleNotesInDb,
} from '../db/notesDb';
import { fetchSampleNotesApi } from '../api/notesApi';

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  addNote: (title: string, body: string) => Promise<number>;
  updateNote: (id: number, title: string, body: string) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  importSampleNotes: () => Promise<number>;
  refreshNotes: () => Promise<void>;
  getNoteById: (id: number) => Note | undefined;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshNotes = useCallback(async () => {
    try {
      const data = await fetchNotesFromDb();
      setNotes(data);
    } catch (err) {
      console.error('Failed to load notes from SQLite:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const addNote = useCallback(async (title: string, body: string): Promise<number> => {
    const finalTitle = title.trim() || 'Untitled Note';
    const id = await insertNoteInDb(finalTitle, body);
    await refreshNotes();
    return id;
  }, [refreshNotes]);

  const updateNote = useCallback(async (id: number, title: string, body: string): Promise<void> => {
    const finalTitle = title.trim() || 'Untitled Note';
    await updateNoteInDb(id, finalTitle, body);
    await refreshNotes();
  }, [refreshNotes]);

  const deleteNote = useCallback(async (id: number): Promise<void> => {
    await deleteNoteFromDb(id);
    await refreshNotes();
  }, [refreshNotes]);

  const toggleFavorite = useCallback(async (id: number): Promise<void> => {
    await toggleFavoriteInDb(id);
    await refreshNotes();
  }, [refreshNotes]);

  const importSampleNotes = useCallback(async (): Promise<number> => {
    const samplePosts = await fetchSampleNotesApi();
    await insertMultipleNotesInDb(samplePosts);
    await refreshNotes();
    return samplePosts.length;
  }, [refreshNotes]);

  const getNoteById = useCallback((id: number): Note | undefined => {
    return notes.find((n) => n.id === id);
  }, [notes]);

  return (
    <NotesContext.Provider
      value={{
        notes,
        isLoading,
        addNote,
        updateNote,
        deleteNote,
        toggleFavorite,
        importSampleNotes,
        refreshNotes,
        getNoteById,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
