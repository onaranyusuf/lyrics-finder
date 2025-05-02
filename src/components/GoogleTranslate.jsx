import React, { useState, useEffect } from "react";
import BrokenImg from "../assets/broken-image.png";

const GoogleTranslate = ({ lyrics, song }) => {
  const [targetLanguage, setTargetLanguage] = useState("");
  const [translatedLyrics, setTranslatedLyrics] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!lyrics || !targetLanguage) return;
    try {
      setIsTranslating(true);
      setTranslatedLyrics("");

      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(
          lyrics
        )}`
      );
      const data = await response.json();

      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translatedText = data[0].map((segment) => segment[0]).join("");
        setTranslatedLyrics(translatedText);
      } else {
        console.error("Error translating lyrics:", data);
        setTranslatedLyrics("Translation Error: Could not parse response.");
      }
    } catch (error) {
      console.error("Error translating lyrics:", error);
      setTranslatedLyrics("Translation Error: Network or fetch failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    setTranslatedLyrics("");
  }, [lyrics]);
  useEffect(() => {
    setTranslatedLyrics("");
  }, [targetLanguage]);

  return (
    <div className="mt-5 bg-white shadow-md rounded-lg p-4 lg:w-1/2">
      <h3 className="text-xl font-semibold mb-2">Translate Lyrics</h3>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
        <label
          htmlFor="targetLanguage"
          className="text-sm font-semibold mb-1 sm:mb-0"
        >
          Select Target Language:
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <select
            id="targetLanguage"
            className="border border-gray-300 rounded px-2 py-1"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="tr">Türkçe 🇹🇷 🐺</option>
            <option value="en">English 🇬🇧</option>
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
          </select>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleTranslate}
            disabled={!targetLanguage || isTranslating || !lyrics}
          >
            {isTranslating ? "Translating..." : "Translate"}
          </button>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <img
          src={song.image || BrokenImg}
          alt={song.title || "Song Art"}
          className="w-14 h-14 lg:w-20 lg:h-20 object-cover rounded-lg items-center flex-shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = BrokenImg;
          }}
        />
        <div>
          <h3 className="text-md lg:text-xl font-bold ">
            {song.title || "Unknown Title"}
          </h3>
          <h3 className="text-md lg:text-lg font-semibold text-gray-700">
            {song.artist || "Unknown Artist"}
          </h3>
        </div>
      </div>

      {isTranslating ? (
        <div className="flex justify-center items-center h-40 space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-500">Translating...</span>
        </div>
      ) : translatedLyrics ? (
        <pre className="whitespace-pre-wrap mt-2 bg-gray-50 p-3 rounded text-sm lg:text-base">
          {translatedLyrics}
        </pre>
      ) : (
        <p className="text-gray-500 mt-2">
          Select a language and click Translate.
        </p>
      )}
    </div>
  );
};

export default GoogleTranslate;
