import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../app/store";
import {
  addMusic,
  removeMusic,
  loadPlaylists,
} from "../features/playlist/playlistSlice";

import type { TheAudioDBTrack } from "../types/theAudioDB";
import {
  searchByArtistAndTitleOrAlbum,
  getTopTracks,
} from "../service/theAudioDBService";

import "../pages/css/PlaylistDetailPage.css";

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const playlists = useSelector((state: RootState) => state.playlist.playlists);
  const [searchTerm, setSearchTerm] = useState("");
  const [artistTerm, setArtistTerm] = useState("");
  const [searchResults, setSearchResults] = useState<TheAudioDBTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasRequestedLoad, setHasRequestedLoad] = useState(false);

  const numericId = Number(id);

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");

    if (!email) {
      navigate("/login");
      return;
    }

    if (!hasRequestedLoad) {
      dispatch(loadPlaylists(email));
      setHasRequestedLoad(true);
    }
  }, [dispatch, navigate, hasRequestedLoad]);

  const playlist = playlists.find((p) => p.id === numericId);

  if (!hasRequestedLoad) {
    return <p>Carregando playlist...</p>;
  }

  if (!playlist) {
    return <p>Playlist não encontrada.</p>;
  }

  const handleSearch = async () => {
    if (!searchTerm.trim() && !artistTerm.trim()) {
      alert("Digite pelo menos o nome da música ou do artista.");
      return;
    }

    setLoading(true);
    try {
      let results: TheAudioDBTrack[] = [];

      if (searchTerm && artistTerm) {
        results = await searchByArtistAndTitleOrAlbum(artistTerm, searchTerm);
      } else if (artistTerm && !searchTerm) {
        const top = await getTopTracks(artistTerm);
        results = top.slice(0, 10);
      }

      setSearchResults(results || []);
    } catch (error) {
      console.error("Erro ao buscar músicas:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setArtistTerm("");
    setSearchResults([]);
  };

  const handleAddFromAPI = (
    nome: string,
    artista: string,
    genero: string,
    ano: number
  ) => {
    dispatch(
      addMusic({
        playlistId: numericId,
        music: {
          nome, artista, genero, ano,
          id: 0
        },
      })
    );
  };

  const handleRemoveMusic = (musicaId: number) => {
    const confirmDelete = confirm("Tem certeza que deseja remover esta música?");
    if (!confirmDelete) return;

    dispatch(
      removeMusic({
        playlistId: numericId,
        musicId: musicaId,
      })
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="playlist-detail-wrapper">
      <header className="playlist-detail-header">
        <h1>{playlist.nome} 🎶</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <main className="playlist-detail-content">
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
              {searchResults.map((item) => {
                const nome =
                  item.strTrack ?? item.strAlbum ?? "Sem título";
                const artista = item.strArtist ?? "Desconhecido";
                const genero = item.strGenre ?? "";
                const ano = Number(item.intYearReleased) || 0;

                return (
                  <div
                    key={item.idTrack || item.idArtist}
                    className="music-card"
                  >
                    <div className="music-info">
                      <div className="music-text">
                        <h3>{nome}</h3>
                        <p>
                          {artista} • {genero || "Sem gênero"} •{" "}
                          {ano || "—"}
                        </p>
                      </div>
                    </div>

                    <button
                      className="add-btn"
                      onClick={() =>
                        handleAddFromAPI(nome, artista, genero, ano)
                      }
                    >
                      ➕ Adicionar
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {!loading &&
            searchResults.length === 0 &&
            (searchTerm || artistTerm) && (
              <p className="no-results">
                Nenhum resultado encontrado 😢
              </p>
            )}
        </section>

        <section className="music-list">
          <h2>🎵 Músicas da playlist</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Filtrar por nome ou artista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {playlist.musicas.length === 0 ? (
            <p className="no-music">Nenhuma música adicionada ainda 💔</p>
          ) : (
            playlist.musicas
              .filter((musica) =>
                [musica.nome, musica.artista].some((campo) =>
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
