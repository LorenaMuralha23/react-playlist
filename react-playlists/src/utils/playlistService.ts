// src/utils/playlistService.ts
import { getPlaylists, savePlaylists, type Playlist, type Musica } from "./localStorageHelper";

/**
 * Retorna todas as playlists do usuário logado.
 */
export function getUserPlaylists(usuarioId: string): Playlist[] {
  const playlists = getPlaylists();
  return playlists.filter((p) => p.usuarioId === usuarioId);
}

/**
 * Cria uma nova playlist.
 */
export function createPlaylist(nome: string, usuarioId: string): Playlist {
  const playlists = getPlaylists();
  const newPlaylist: Playlist = {
    id: Date.now(),
    nome: nome.trim(),
    usuarioId,
    musicas: [],
  };
  const updated = [...playlists, newPlaylist];
  savePlaylists(updated);
  return newPlaylist;
}

/**
 * Atualiza o nome de uma playlist.
 */
export function updatePlaylistName(
  id: number,
  novoNome: string,
  usuarioId: string
): boolean {
  const playlists = getPlaylists();
  const index = playlists.findIndex((p) => p.id === id && p.usuarioId === usuarioId);

  if (index === -1) return false;

  playlists[index].nome = novoNome.trim();
  savePlaylists(playlists);
  return true;
}

/**
 * Adiciona uma música em uma playlist.
 */
export function addMusicToPlaylist(
  playlistId: number,
  musica: Omit<Musica, "id">,
  usuarioId: string
): boolean {
  const playlists = getPlaylists();
  const index = playlists.findIndex((p) => p.id === playlistId && p.usuarioId === usuarioId);

  if (index === -1) return false;

  const newMusic: Musica = { id: Date.now(), ...musica };
  playlists[index].musicas.push(newMusic);

  savePlaylists(playlists);
  return true;
}

/**
 * Atualiza informações de uma música específica.
 */
export function updateMusicInPlaylist(
  playlistId: number,
  musicaId: number,
  musicaAtualizada: Partial<Musica>,
  usuarioId: string
): boolean {
  const playlists = getPlaylists();
  const playlist = playlists.find((p) => p.id === playlistId && p.usuarioId === usuarioId);
  if (!playlist) return false;

  const indexMusica = playlist.musicas.findIndex((m) => m.id === musicaId);
  if (indexMusica === -1) return false;

  playlist.musicas[indexMusica] = {
    ...playlist.musicas[indexMusica],
    ...musicaAtualizada,
  };

  savePlaylists(playlists);
  return true;
}

/**
 * Remove uma música de uma playlist.
 */
export function removeMusicFromPlaylist(
  playlistId: number,
  musicaId: number,
  usuarioId: string
): boolean {
  const playlists = getPlaylists();
  const playlist = playlists.find((p) => p.id === playlistId && p.usuarioId === usuarioId);
  if (!playlist) return false;

  playlist.musicas = playlist.musicas.filter((m) => m.id !== musicaId);
  savePlaylists(playlists);
  return true;
}

/**
 * Exclui uma playlist inteira.
 */
export function deletePlaylist(id: number, usuarioId: string): boolean {
  const playlists = getPlaylists();
  const filtered = playlists.filter((p) => !(p.id === id && p.usuarioId === usuarioId));

  if (filtered.length === playlists.length) return false; // Nenhuma removida
  savePlaylists(filtered);
  return true;
}
