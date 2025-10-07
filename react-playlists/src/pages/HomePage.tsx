import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { Playlist } from "../utils/localStorageHelper";
import {
  getUserPlaylists,
  createPlaylist,
  updatePlaylistName,
  deletePlaylist,
} from "../utils/playlistService";
import "./HomePage.css";
import type { RootState } from "../app/store";

export default function HomePage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [lastLogin, setLastLogin] = useState("");

 useEffect(() => {
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    // ✅ Corrigido: tenta mostrar previousLogin; se não houver, mostra lastLogin
    const previousLogin = sessionStorage.getItem("previousLogin");
    const lastLoginValue = sessionStorage.getItem("lastLogin");

    if (previousLogin) {
      setLastLogin(previousLogin);
    } else if (lastLoginValue) {
      setLastLogin(lastLoginValue);
    }

    setPlaylists(getUserPlaylists(currentUser.email));
  }, [currentUser]);


  const handleAddPlaylist = () => {
    if (!playlistName.trim() || !currentUser) return;
    const newPlaylist = createPlaylist(playlistName, currentUser.email);
    setPlaylists((prev) => [...prev, newPlaylist]);
    setPlaylistName("");
  };

  const handleEditPlaylist = (id: number) => {
    if (!playlistName.trim() || !currentUser) return;

    const updated = updatePlaylistName(id, playlistName, currentUser.email);
    if (updated) {
      setPlaylists(getUserPlaylists(currentUser.email));
      setEditingId(null);
      setPlaylistName("");
    }
  };

  const handleDeletePlaylist = (id: number) => {
    if (!currentUser) return;
    const confirmDelete = confirm("Tem certeza que deseja excluir esta playlist?");
    if (!confirmDelete) return;

    const deleted = deletePlaylist(id, currentUser.email);
    if (deleted) {
      setPlaylists(getUserPlaylists(currentUser.email));
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="home-wrapper">
      <header className="home-header">
        <div className="header-info">
          <h1 className="home-title">
            💖 Olá, {currentUser?.email.split("@")[0]}!
          </h1>
          {lastLogin && (
            <p className="last-login">
              Último login: {new Date(lastLogin).toLocaleString("pt-BR")}
            </p>
          )}
        </div>

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
                  <p className="creator">Criada por {playlist.usuarioEmail}</p>
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
