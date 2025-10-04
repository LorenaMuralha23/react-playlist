// Funções auxiliares para lidar com playlists no localStorage

export interface Musica {
  id: number;
  nome: string;
  artista: string;
  genero: string;
  ano: number;
}

export interface Playlist {
  id: number;
  nome: string;
  usuarioId: string;
  musicas: Musica[];
}

const STORAGE_KEY = "playlists";

export const getPlaylists = (): Playlist[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePlaylists = (playlists: Playlist[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
};
