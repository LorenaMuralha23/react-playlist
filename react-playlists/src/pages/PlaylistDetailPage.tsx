import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Musica, Playlist } from "../utils/localStorageHelper";
import {
  getUserPlaylists,
  addMusicToPlaylist,
  updateMusicInPlaylist,
  removeMusicFromPlaylist,
} from "../utils/playlistService";
import "./PlaylistDetailPage.css";

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Formulário da música
  const [form, setForm] = useState({
    nome: "",
    artista: "",
    genero: "",
    ano: "",
  });

  // 🔹 Carrega playlist do usuário logado
  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    if (!email) {
      navigate("/login");
      return;
    }

    setUserEmail(email);
    const playlists = getUserPlaylists(email);
    const found = playlists.find((p) => p.id === Number(id));

    if (!found) {
      alert("Você não tem permissão para acessar esta playlist.");
      navigate("/home");
      return;
    }

    setPlaylist(found);
  }, [id, navigate]);

  // 🔹 Atualiza campo do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Adicionar nova música
  // 🔹 Adicionar nova música
const handleAddMusic = () => {
  if (!form.nome.trim()) return;

  // converte "ano" para número
  const musicData = {
    nome: form.nome,
    artista: form.artista,
    genero: form.genero,
    ano: Number(form.ano) || 0, // converte ou usa 0 se estiver vazio
  };

  const success = addMusicToPlaylist(Number(id), musicData, userEmail);
  if (success) {
    const playlists = getUserPlaylists(userEmail);
    const updated = playlists.find((p) => p.id === Number(id))!;
    setPlaylist(updated);
    setForm({ nome: "", artista: "", genero: "", ano: "" });
  }
};

// 🔹 Editar música
const handleEditMusic = (musicaId: number) => {
  if (!form.nome.trim()) return;

  const musicData = {
    nome: form.nome,
    artista: form.artista,
    genero: form.genero,
    ano: Number(form.ano) || 0,
  };

  const success = updateMusicInPlaylist(Number(id), musicaId, musicData, userEmail);
  if (success) {
    const playlists = getUserPlaylists(userEmail);
    const updated = playlists.find((p) => p.id === Number(id))!;
    setPlaylist(updated);
    setEditingId(null);
    setForm({ nome: "", artista: "", genero: "", ano: "" });
  }
};

  // 🔹 Excluir música
  const handleDeleteMusic = (musicaId: number) => {
    const success = removeMusicFromPlaylist(Number(id), musicaId, userEmail);
    if (success) {
      const playlists = getUserPlaylists(userEmail);
      const updated = playlists.find((p) => p.id === Number(id))!;
      setPlaylist(updated);
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  if (!playlist) return <p>Carregando...</p>;

  return (
    <div className="playlist-detail-wrapper">
      <header className="playlist-detail-header">
        <h1>{playlist.nome} 💖</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <main className="playlist-detail-content">
        {/* Formulário */}
        <div className="music-form">
          <input
            type="text"
            name="nome"
            placeholder="Nome da música"
            value={form.nome}
            onChange={handleChange}
          />
          <input
            type="text"
            name="artista"
            placeholder="Artista"
            value={form.artista}
            onChange={handleChange}
          />
          <input
            type="text"
            name="genero"
            placeholder="Gênero"
            value={form.genero}
            onChange={handleChange}
          />
          <input
            type="number"
            name="ano"
            placeholder="Ano"
            value={form.ano}
            onChange={handleChange}
          />
          <button
            className="add-btn"
            onClick={() =>
              editingId ? handleEditMusic(editingId) : handleAddMusic()
            }
          >
            {editingId ? "Salvar" : "Adicionar"}
          </button>
          {editingId && (
            <button
              className="cancel-btn"
              onClick={() => {
                setEditingId(null);
                setForm({ nome: "", artista: "", genero: "", ano: "" });
              }}
            >
              Cancelar
            </button>
          )}
        </div>

        {/* Lista de músicas */}
        <div className="music-list">
          {playlist.musicas.length === 0 ? (
            <p className="no-music">Nenhuma música adicionada ainda 💔</p>
          ) : (
            playlist.musicas.map((musica: Musica) => (
              <div key={musica.id} className="music-card">
                <div className="music-info">
                  <h3>{musica.nome}</h3>
                  <p>
                    {musica.artista} • {musica.genero} • {musica.ano}
                  </p>
                </div>
                <div className="music-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingId(musica.id);
                      setForm({
                        nome: musica.nome,
                        artista: musica.artista,
                        genero: musica.genero,
                        ano: String(musica.ano),
                      });
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMusic(musica.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Voltar para Home
        </button>
      </main>
    </div>
  );
}
