import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import SongDetail from './components/SongDetail';
import GoogleTranslate from './components/GoogleTranslate';
import api from "./api";

function App() {
  const [song, setSong] = useState({});
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false); // Loading state'i ekleyin

  const fetchLyrics = async (id) => {
    setLoading(true); // API çağrısı başlamadan önce loading'i true yap
    try {
      const res = await api.getLyrics(id);
      let lyricsText = res.data;
  
      const firstNewLineIndex = lyricsText.indexOf('\n');
      if (firstNewLineIndex !== -1) {
        lyricsText = lyricsText.substring(firstNewLineIndex + 1);
      }
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
      

  
      setLyrics(lyricsText);
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      setLyrics("");
    } finally {
      setLoading(false); // API çağrısı bittikten sonra loading'i false yap
    }
  };

  useEffect(() => {
    if (song.id) {
      fetchLyrics(song.id);
    }
  }, [song]);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold text-center mb-5">Song Lyrics Finder</h1>

      <Search onSongSelect={(result) => setSong(result)} />
    <div className='gap-4 lg:flex'>
      {song.title && <SongDetail song={song} lyrics={lyrics} loading={loading} />}
      {/* GoogleTranslate bileşenini ekleyin */}
      {lyrics && <GoogleTranslate lyrics={lyrics} song={song} />}
      </div>
    </div>
  );
}

export default App;


