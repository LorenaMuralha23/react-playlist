import { useEffect, useState } from "react";
import type { Playlist } from "../utils/localStorageHelper";
import {
  getUserPlaylists,
  createPlaylist,
  updatePlaylistName,
  deletePlaylist,
} from "../utils/playlistService";
import "./HomePage.css";

export default function HomePage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState("");

  // 🔹 Carrega playlists do usuário logado
  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    if (!email) {
      window.location.href = "/login";
      return;
    }

    setUserEmail(email);
    setPlaylists(getUserPlaylists(email));
  }, []);

  // 🔹 Criar nova playlist
  const handleAddPlaylist = () => {
    if (!playlistName.trim()) return;

    const newPlaylist = createPlaylist(playlistName, userEmail);
    setPlaylists((prev) => [...prev, newPlaylist]);
    setPlaylistName("");
  };

  // 🔹 Editar playlist existente
  const handleEditPlaylist = (id: number) => {
    if (!playlistName.trim()) return;

    const updated = updatePlaylistName(id, playlistName, userEmail);
    if (updated) {
      setPlaylists(getUserPlaylists(userEmail));
      setEditingId(null);
      setPlaylistName("");
    }
  };

  // 🔹 Excluir playlist
  const handleDeletePlaylist = (id: number) => {
    const deleted = deletePlaylist(id, userEmail);
    if (deleted) {
      setPlaylists(getUserPlaylists(userEmail));
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="home-wrapper">
      <header className="home-header">
        <h1 className="home-title">💖 Minhas Playlists</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <main className="home-content">
        <div className="playlist-form">
          <input
            type="text"
            placeholder={editingId ? "Renomear playlist..." : "Nome da nova playlist..."}
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <button
            className="add-btn"
            onClick={() =>
              editingId ? handleEditPlaylist(editingId) : handleAddPlaylist()
            }
          >
            {editingId ? "Salvar" : "Criar"}
          </button>
          {editingId && (
            <button className="cancel-btn" onClick={() => setEditingId(null)}>
              Cancelar
            </button>
          )}
        </div>

        <div className="playlist-grid">
          {playlists.length === 0 ? (
            <p className="no-playlists">Nenhuma playlist criada ainda 💔</p>
          ) : (
            playlists.map((playlist) => (
              <div key={playlist.id} className="playlist-card">
                <div className="playlist-info">
                  <h3>{playlist.nome}</h3>
                  <p>{playlist.musicas.length} músicas</p>
                </div>
                <div className="playlist-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingId(playlist.id);
                      setPlaylistName(playlist.nome);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeletePlaylist(playlist.id)}
                  >
                    Excluir
                  </button>
                  <button
                    className="open-btn"
                    onClick={() => (window.location.href = `/playlists/${playlist.id}`)}
                  >
                    Abrir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
