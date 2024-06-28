import React, { useState, useEffect } from 'react';
import BrokenImg from '../assets/broken-image.png';

const GoogleTranslate = ({ lyrics, song }) => {
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translatedLyrics, setTranslatedLyrics] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [key, setKey] = useState(0); // Çeviri sıfırlama anahtarı

  // Hedef dile çeviri fonksiyonu
  const handleTranslate = async () => {
    try {
      setIsTranslating(true); // Çeviri işlemi başladığında translating'i true yap

      const lines = lyrics.split('\n');
      const translatedLines = [];

      for (let line of lines) {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(line)}`);
        const data = await response.json();

        // Gelen cevapta çeviri bulunuyorsa
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const translatedText = data[0][0][0]; // Çevirilen satır
          translatedLines.push(translatedText);
        } else {
          console.error("Error translating line:", line, data);
          translatedLines.push(line); // Hata durumunda satırı orijinal olarak ekle
        }
      }

      const translatedText = translatedLines.join('\n');
      setTranslatedLyrics(translatedText);
    } catch (error) {
      console.error("Error translating lyrics:", error);
      setTranslatedLyrics("Translation Error");
    } finally {
      setIsTranslating(false); // Çeviri işlemi bittikten sonra translating'i false yap
    }
  };

  // Yeni şarkı seçildiğinde çeviriyi sıfırla
  useEffect(() => {
    setKey(prevKey => prevKey + 1); // Anahtarı artırarak çeviriyi sıfırla
  }, [lyrics]);

  return (
    <div className="mt-5 bg-white shadow-md rounded-lg p-4 lg:w-1/2" key={key}>
      <h3 className="text-xl font-semibold mb-2">Translate Lyrics</h3>
      <div className="flex items-center space-x-2 mb-2">
        <label htmlFor="targetLanguage" className="text-sm font-semibold">
          Select Target Language:
        </label>
        <div>
        <select
          id="targetLanguage"
          className="border border-gray-300 rounded px-2 py-1"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
            <option value="">Select...</option>
            <option value="en">English 🇬🇧</option>
            <option value="tr">Türkçe 🇹🇷 🐺</option>
            <option value="de">German 🇩🇪</option>
            <option value="fr">French 🇫🇷</option>
            <option value="es">Spanish 🇪🇸</option>
            <option value="it">Italian 🇮🇹</option>
            <option value="ru">Russian 🇷🇺</option>
            <option value="pt">Portuguese 🇵🇹</option>
            <option value="nl">Dutch 🇳🇱</option>
            <option value="pl">Polish 🇵🇱</option>
            <option value="sv">Swedish 🇸🇪</option>
            <option value="fi">Finnish 🇫🇮</option>
            <option value="da">Danish 🇩🇰</option>
            <option value="el">Greek 🇬🇷</option>
            <option value="zh-CN">Chinese (Simplified) 🇨🇳</option>
            <option value="ja">Japanese 🇯🇵</option>
            <option value="ko">Korean 🇰🇷</option>
            <option value="no">Norwegian 🇳🇴</option>
            <option value="he">Hebrew 🇮🇱</option>
            <option value="id">Indonesian 🇮🇩</option>
            <option value="ms">Malay 🇲🇾</option>
            <option value="th">Thai 🇹🇭</option>
            <option value="hi">Hindi 🇮🇳</option>
            <option value="tl">Filipino 🇵🇭</option>

          {/* Diğer diller buraya eklenebilir */}
        </select>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 lg:ml-5 md:ml-5 mt-2"
          onClick={handleTranslate}
          disabled={!targetLanguage}
        >
          Translate
        </button>
        </div>
      </div>
      <div className="flex space-x-4">
        <img
          src={song.image || BrokenImg}
          alt={song.title}
          className="w-14 h-14 lg:w-22 lg:h-22 object-cover rounded-lg items-center"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = BrokenImg;
          }}
        />
        <div>
          <h3 className="text-md lg:text-xl font-bold ">{song.title}</h3>
          <h3 className="text-md lg:text-xl font-semibold">{song.artist}</h3>
        </div>
      </div>
      {isTranslating ? (
        <div className="flex justify-center items-center h-40 space-x-2">
          <div class="animation">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : translatedLyrics ? (
        <pre className="whitespace-pre-wrap mt-2">{translatedLyrics}</pre>
      ) : null}
    </div>
  );
};

export default GoogleTranslate;
