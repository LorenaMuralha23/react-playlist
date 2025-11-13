import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Musica, Playlist } from "../../utils/localStorageHelper";

interface PlaylistState {
  playlists: Playlist[];
  userEmail: string | null;
}

const initialState: PlaylistState = {
  playlists: [],
  userEmail: null,
};

function saveToLocal(email: string, playlists: Playlist[]) {
  localStorage.setItem(`playlists_${email}`, JSON.stringify(playlists));
}

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    loadPlaylists(state, action: PayloadAction<string | null>) {
      state.userEmail = action.payload;

      const data = action.payload
        ? localStorage.getItem(`playlists_${action.payload}`)
        : null;

      state.playlists = data ? JSON.parse(data) : [];
    },

    createPlaylist(state, action: PayloadAction<string>) {
      if (!state.userEmail) return;

      const newPlaylist: Playlist = {
        id: Date.now(),
        nome: action.payload,
        musicas: [],
        usuarioId: state.userEmail,
      };

      state.playlists.push(newPlaylist);

      saveToLocal(state.userEmail, state.playlists);
    },

    renamePlaylist(state, action: PayloadAction<{ id: number; newName: string }>) {
      if (!state.userEmail) return;

      const p = state.playlists.find(pl => pl.id === action.payload.id);
      if (!p) return;

      p.nome = action.payload.newName;

      saveToLocal(state.userEmail, state.playlists);
    },

    deletePlaylist(state, action: PayloadAction<number>) {
      if (!state.userEmail) return;

      state.playlists = state.playlists.filter(p => p.id !== action.payload);

      saveToLocal(state.userEmail, state.playlists);
    },

    addMusic(state, action: PayloadAction<{ playlistId: number; music: Musica }>) {
      if (!state.userEmail) return;

      const playlist = state.playlists.find(p => p.id === action.payload.playlistId);
      if (!playlist) return;

      playlist.musicas.push({
        ...action.payload.music,
        id: Date.now(),
      });

      saveToLocal(state.userEmail, state.playlists);
    },

    removeMusic(state, action: PayloadAction<{ playlistId: number; musicId: number }>) {
      if (!state.userEmail) return;

      const playlist = state.playlists.find(p => p.id === action.payload.playlistId);
      if (!playlist) return;

      playlist.musicas = playlist.musicas.filter(m => m.id !== action.payload.musicId);

      saveToLocal(state.userEmail, state.playlists);
    },

    clearPlaylists(state) {
      state.playlists = [];
      state.userEmail = null;
    },
  },
});

export const {
  loadPlaylists,
  createPlaylist,
  renamePlaylist,
  deletePlaylist,
  addMusic,
  removeMusic,
  clearPlaylists,
} = playlistSlice.actions;

export default playlistSlice.reducer;
