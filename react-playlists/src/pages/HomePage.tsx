import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";

import "../pages/css/HomePage.css";
import { clearPlaylists, createPlaylist, deletePlaylist, loadPlaylists, renamePlaylist } from "../features/playlist/playlistSlice";
import { logoutUser } from "../features/auth/authSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const playlists = useSelector((state: RootState) => state.playlist.playlists);

  const [playlistName, setPlaylistName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    if (!email) return;

    dispatch(loadPlaylists(email));
  }, [dispatch]);

  const handleAddPlaylist = () => {
    if (!playlistName.trim()) return;
    dispatch(createPlaylist(playlistName));
    setPlaylistName("");
  };

  const handleRenamePlaylist = () => {
    if (!playlistName.trim() || editingId === null) return;

    dispatch(renamePlaylist({ id: editingId, newName: playlistName }));
    setEditingId(null);
    setPlaylistName("");
  };

  const handleDeletePlaylist = (id: number) => {
    dispatch(deletePlaylist(id));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userEmail");

    dispatch(logoutUser());       
    dispatch(clearPlaylists());   

    navigate("/login");            
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
            placeholder={editingId ? "Renomear playlist..." : "Criar playlist..."}
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />

          <button
            className="add-btn"
            onClick={editingId ? handleRenamePlaylist : handleAddPlaylist}
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
                    onClick={() => navigate(`/playlists/${playlist.id}`)}
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
