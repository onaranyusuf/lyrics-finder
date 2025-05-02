import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import SongDetail from './components/SongDetail';
import GoogleTranslate from './components/GoogleTranslate';
import api from "./api";

function App() {
  const [song, setSong] = useState({});
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLyrics = async (artist, title) => {
    setLoading(true);
    try {
      const res = await api.getLyrics(artist, title);
      let lyricsText = res.lyrics || ""; // Lyrics.ovh, { lyrics: "..." } döndürür

      // Lyrics.ovh'dan gelen veriyi temizle (gerekiyorsa)
      if (lyricsText) {
        // İlk satırı kaldırma (genelde Lyrics.ovh'da gerekmez)
        const firstNewLineIndex = lyricsText.indexOf('\n');
        if (firstNewLineIndex !== -1) {
          lyricsText = lyricsText.substring(firstNewLineIndex + 1);
        }
        // Son 5 karakteri kaldırma (isteğe bağlı, Lyrics.ovh için gerekmeyebilir)
        if (lyricsText.length > 5) {
          lyricsText = lyricsText.substring(0, lyricsText.length - 5);
        }
        // Son satırdaki sayıları ve sonrasını kaldırma
        let lines = lyricsText.split('\n');
        if (lines.length > 0) {
          let words = lines[lines.length - 1].split(' ');
          if (words.length > 0) {
            words[words.length - 1] = words[words.length - 1].replace(/\d.*/, '');
            lines[lines.length - 1] = words.join(' ');
          }
        }
        lyricsText = lines.join('\n');
      }

      setLyrics(lyricsText);
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      setLyrics("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (song.artist && song.title) {
      fetchLyrics(song.artist, song.title);
    }
  }, [song]);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold text-center mb-5">Song Lyrics Finder</h1>
      <Search onSongSelect={(result) => setSong(result)} />
      <div className='gap-4 lg:flex'>
        {song.title && <SongDetail song={song} lyrics={lyrics} loading={loading} />}
        {lyrics && <GoogleTranslate lyrics={lyrics} song={song} />}
      </div>
    </div>
  );
}

export default App;