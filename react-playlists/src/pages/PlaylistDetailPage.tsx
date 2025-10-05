import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Playlist } from "../utils/localStorageHelper";
import {
  getUserPlaylists,
  addMusicToPlaylist,
  removeMusicFromPlaylist,
} from "../utils/playlistService";

import "./PlaylistDetailPage.css";
import type { TheAudioDBTrack } from "../types/theAudioDB";
import { searchByArtistAndTitleOrAlbum, getTopTracks } from "../utils/theAudioDBService";

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [artistTerm, setArtistTerm] = useState("");
  const [searchResults, setSearchResults] = useState<TheAudioDBTrack[]>([]);
  const [loading, setLoading] = useState(false);

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

  // 🔍 Buscar músicas com base nos termos
  const handleSearch = async () => {
    if (!searchTerm.trim() && !artistTerm.trim()) {
      alert("Digite pelo menos o nome da música ou do artista.");
      return;
    }

    setLoading(true);
    try {
      let results: TheAudioDBTrack[] = [];

      if (searchTerm && artistTerm) {
        // Buscar música ou álbum específico
        results = await searchByArtistAndTitleOrAlbum(artistTerm, searchTerm);
      } else if (artistTerm && !searchTerm) {
        // Buscar top 10 do artista com fallback
        const topTracks = await getTopTracks(artistTerm);
        results = topTracks.length < 10 ? [...topTracks] : topTracks.slice(0, 10);
      }

      setSearchResults(results || []);
    } catch (error) {
      console.error("Erro ao buscar músicas:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 🧹 Limpar busca
  const handleClearSearch = () => {
    setSearchTerm("");
    setArtistTerm("");
    setSearchResults([]);
  };

  // ➕ Adicionar música da API à playlist
  const handleAddFromAPI = (
    nome: string,
    artista: string,
    genero: string,
    ano: number
  ) => {
    const music = { nome, artista, genero, ano };
    const success = addMusicToPlaylist(Number(id), music, userEmail);
    if (success) {
      const playlists = getUserPlaylists(userEmail);
      const updated = playlists.find((p) => p.id === Number(id))!;
      setPlaylist(updated);
    }
  };

  // 🗑️ Remover música da playlist
  const handleRemoveMusic = (musicaId: number) => {
    const confirmDelete = confirm("Tem certeza que deseja remover esta música?");
    if (!confirmDelete) return;

    const success = removeMusicFromPlaylist(Number(id), musicaId, userEmail);
    if (success) {
      const playlists = getUserPlaylists(userEmail);
      const updated = playlists.find((p) => p.id === Number(id))!;
      setPlaylist(updated);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  if (!playlist) return <p>Carregando...</p>;

  return (
    <div className="playlist-detail-wrapper">
      <header className="playlist-detail-header">
        <h1>{playlist.nome} 🎶</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <main className="playlist-detail-content">
        {/* 🔍 BUSCA DE MÚSICAS NA API */}
        <section className="api-search">
          <h2>Buscar músicas via TheAudioDB 🎧</h2>

          <div className="api-search-bar">
            <input
              type="text"
              placeholder="🎵 Nome da música (opcional)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="text"
              placeholder="🎤 Nome do artista (opcional)"
              value={artistTerm}
              onChange={(e) => setArtistTerm(e.target.value)}
            />
            <button className="add-btn" onClick={handleSearch}>
              Buscar
            </button>
            {searchResults.length > 0 && (
              <button className="cancel-btn" onClick={handleClearSearch}>
                Limpar busca
              </button>
            )}
          </div>

          {loading && <p>🔄 Buscando músicas...</p>}

          {!loading && searchResults.length > 0 && (
            <div className="api-results">
              {searchResults.slice(0, 10).map((item) => (
                <div key={item.idTrack || item.idArtist} className="music-card">
                  <div className="music-info">
                    <div className="music-text">
                      <h3>{item.strTrack || item.strAlbum || "Título desconhecido"}</h3>
                      <p>
                        {item.strArtist || "Artista desconhecido"} •{" "}
                        {item.strGenre || "Sem gênero"} •{" "}
                        {item.intYearReleased || "—"}
                      </p>
                    </div>
                  </div>

                  {item.strTrack && (
                    <button
                      className="add-btn"
                      onClick={() =>
                        handleAddFromAPI(
                          item.strTrack || item.strAlbum || "",
                          item.strArtist || "Desconhecido",
                          item.strGenre ?? "",
                          Number(item.intYearReleased) || 0
                        )
                      }
                    >
                      ➕ Adicionar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && searchResults.length === 0 && (searchTerm || artistTerm) && (
            <p className="no-results">Nenhum resultado encontrado 😢</p>
          )}
        </section>

        {/* 🎧 LISTA DE MÚSICAS SALVAS */}
        <section className="music-list">
          <h2>🎵 Músicas da playlist</h2>

          {/* 🔍 Busca interna */}
          <input
            type="text"
            className="search-input"
            placeholder="Filtrar por nome ou artista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filtra músicas já salvas */}
          {playlist.musicas.length === 0 ? (
            <p className="no-music">Nenhuma música adicionada ainda 💔</p>
          ) : (
            playlist.musicas
              .filter((musica) =>
                [musica.nome, musica.artista]
                  .some((campo) =>
                    campo.toLowerCase().includes(searchTerm.toLowerCase())
                  )
              )
              .map((musica) => (
                <div key={musica.id} className="music-card">
                  <div className="music-info">
                    <h3>{musica.nome}</h3>
                    <p>
                      {musica.artista} • {musica.genero} • {musica.ano}
                    </p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleRemoveMusic(musica.id)}
                  >
                    ❌ Remover
                  </button>
                </div>
              ))
          )}
        </section>


        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Voltar para Home
        </button>
      </main>
    </div>
  );
}
