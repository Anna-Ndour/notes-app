export interface Note {
  id: number;
  title: string;
  body: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RootDrawerParamList = {
  Notes: undefined;
  Settings: undefined;
};

export type NotesTabParamList = {
  AllNotes: undefined;
  Favorites: undefined;
};

export type RootStackParamList = {
  DrawerRoot: undefined;
  NoteEditor: { noteId?: number };
};
