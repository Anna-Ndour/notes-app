import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types';

let dbInstance: SQLite.SQLiteDatabase | null = null;
const WEB_STORAGE_KEY = '@notes_app_web_notes_db';

export const getDb = async (): Promise<SQLite.SQLiteDatabase | null> => {
  if (Platform.OS === 'web') {
    return null;
  }
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('notes.db');
    await initDb(dbInstance);
  }
  return dbInstance;
};

export const initDb = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      isFavorite INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
};

// Web Helper Functions
const getWebNotes = async (): Promise<Note[]> => {
  try {
    const raw = await AsyncStorage.getItem(WEB_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveWebNotes = async (notes: Note[]): Promise<void> => {
  await AsyncStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(notes));
};

export const fetchNotesFromDb = async (): Promise<Note[]> => {
  if (Platform.OS === 'web') {
    const notes = await getWebNotes();
    return notes.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  const db = await getDb();
  if (!db) return [];

  const rows = await db.getAllAsync<{
    id: number;
    title: string;
    body: string;
    isFavorite: number;
    createdAt: string;
    updatedAt: string;
  }>('SELECT * FROM notes ORDER BY updatedAt DESC');

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    isFavorite: row.isFavorite === 1,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));
};

export const insertNoteInDb = async (
  title: string,
  body: string
): Promise<number> => {
  const now = new Date().toISOString();

  if (Platform.OS === 'web') {
    const notes = await getWebNotes();
    const newId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
    const newNote: Note = {
      id: newId,
      title,
      body,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };
    notes.unshift(newNote);
    await saveWebNotes(notes);
    return newId;
  }

  const db = await getDb();
  if (!db) return 0;

  const result = await db.runAsync(
    'INSERT INTO notes (title, body, isFavorite, createdAt, updatedAt) VALUES (?, ?, 0, ?, ?)',
    [title, body, now, now]
  );
  return result.lastInsertRowId;
};

export const updateNoteInDb = async (
  id: number,
  title: string,
  body: string
): Promise<void> => {
  const now = new Date().toISOString();

  if (Platform.OS === 'web') {
    const notes = await getWebNotes();
    const idx = notes.findIndex((n) => n.id === id);
    if (idx !== -1) {
      notes[idx] = {
        ...notes[idx],
        title,
        body,
        updatedAt: now,
      };
      await saveWebNotes(notes);
    }
    return;
  }

  const db = await getDb();
  if (!db) return;

  await db.runAsync(
    'UPDATE notes SET title = ?, body = ?, updatedAt = ? WHERE id = ?',
    [title, body, now, id]
  );
};

export const deleteNoteFromDb = async (id: number): Promise<void> => {
  if (Platform.OS === 'web') {
    const notes = await getWebNotes();
    const filtered = notes.filter((n) => n.id !== id);
    await saveWebNotes(filtered);
    return;
  }

  const db = await getDb();
  if (!db) return;

  await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
};

export const toggleFavoriteInDb = async (id: number): Promise<void> => {
  if (Platform.OS === 'web') {
    const notes = await getWebNotes();
    const idx = notes.findIndex((n) => n.id === id);
    if (idx !== -1) {
      notes[idx] = {
        ...notes[idx],
        isFavorite: !notes[idx].isFavorite,
      };
      await saveWebNotes(notes);
    }
    return;
  }

  const db = await getDb();
  if (!db) return;

  await db.runAsync(
    'UPDATE notes SET isFavorite = CASE WHEN isFavorite = 1 THEN 0 ELSE 1 END WHERE id = ?',
    [id]
  );
};

export const insertMultipleNotesInDb = async (
  posts: { title: string; body: string }[]
): Promise<void> => {
  const now = new Date().toISOString();

  if (Platform.OS === 'web') {
    const notes = await getWebNotes();
    let currentMaxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
    for (const post of posts) {
      currentMaxId += 1;
      notes.unshift({
        id: currentMaxId,
        title: post.title,
        body: post.body,
        isFavorite: false,
        createdAt: now,
        updatedAt: now,
      });
    }
    await saveWebNotes(notes);
    return;
  }

  const db = await getDb();
  if (!db) return;

  for (const post of posts) {
    await db.runAsync(
      'INSERT INTO notes (title, body, isFavorite, createdAt, updatedAt) VALUES (?, ?, 0, ?, ?)',
      [post.title, post.body, now, now]
    );
  }
};
