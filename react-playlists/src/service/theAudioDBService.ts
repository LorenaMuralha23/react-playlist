import type { TheAudioDBTrack } from "../types/theAudioDB";

const BASE_URL = "https://www.theaudiodb.com/api/v1/json/2";

interface TheAudioDBAlbum {
  idAlbum: string;
  strAlbum: string;
  strArtist?: string;
  strGenre?: string;
  strStyle?: string;
  intYearReleased?: string;
  intYear?: string;
  strAlbumThumb?: string;
}


export async function searchByArtistAndTitleOrAlbum(
  artist: string,
  title: string
): Promise<TheAudioDBTrack[]> {
  try {
    const trackUrl = `${BASE_URL}/searchtrack.php?s=${encodeURIComponent(
      artist
    )}&t=${encodeURIComponent(title)}`;

    console.log("🎵 Tentando buscar música:", trackUrl);
    const trackRes = await fetch(trackUrl);

    if (!trackRes.ok) {
      console.warn("searchByArtistAndTitleOrAlbum: erro HTTP na busca de música", trackRes.status);
    } else {
      const trackText = await trackRes.text();
      if (trackText) {
        const trackData = JSON.parse(trackText);
        if (trackData?.track?.length) {
          console.log(`✅ Encontradas ${trackData.track.length} músicas para ${title} de ${artist}`);
          return trackData.track.slice(0, 10);
        }
      }
    }

    const albumUrl = `${BASE_URL}/searchalbum.php?s=${encodeURIComponent(
      artist
    )}&a=${encodeURIComponent(title)}`;

    console.log("💿 Tentando buscar álbum:", albumUrl);
    const albumRes = await fetch(albumUrl);

    if (!albumRes.ok) {
      console.warn("searchByArtistAndTitleOrAlbum: erro HTTP na busca de álbum", albumRes.status);
      return [];
    }

    const albumText = await albumRes.text();
    if (!albumText) {
      console.warn("Nenhum dado retornado da busca de álbum.");
      return [];
    }

    const albumData = JSON.parse(albumText);

    if (albumData?.album?.length) {
      console.log(`✅ Encontrados ${albumData.album.length} álbuns para ${artist}`);
      return albumData.album.slice(0, 10).map((a: TheAudioDBAlbum, i: number) => ({
        idTrack: a.idAlbum || `album-${i}`,
        strTrack: a.strAlbum,
        strArtist: a.strArtist || artist,
        strGenre: a.strGenre || a.strStyle || "Desconhecido",
        intYearReleased: a.intYearReleased || a.intYear || "—",
        strTrackThumb: a.strAlbumThumb || "",
      }));
    }

    console.warn("❌ Nenhum resultado encontrado nem por música nem por álbum.");
    return [];
  } catch (error) {
    console.error("Erro na busca (música/álbum):", error);
    return [];
  }
}


export async function getTopTracks(artist: string): Promise<TheAudioDBTrack[]> {
  try {
    const url = `${BASE_URL}/track-top10.php?s=${encodeURIComponent(artist)}`;
    console.log("🏆 getTopTracks.URL ::", url);

    const res = await fetch(url);
    if (!res.ok) {
      console.warn("getTopTracks: erro HTTP", res.status);
      return [];
    }

    const text = await res.text();
    if (!text) {
      console.warn("getTopTracks: resposta vazia.");
      return [];
    }

    const data = JSON.parse(text);
    const tracks = data.track || data.loved || [];
    console.log(`✅ getTopTracks retornou ${tracks.length} faixas para ${artist}`);
    return tracks.slice(0, 10);
  } catch (error) {
    console.error("Erro em getTopTracks:", error);
    return [];
  }
}
