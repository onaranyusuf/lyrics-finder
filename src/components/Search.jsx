import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import BrokenImg from '../assets/broken-image.png';

const Search = ({ onSongSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(false); // Loading state'i ekleyin
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      handleSearch();
    }
  }, [debouncedQuery]);

  const handleSearch = async () => {
    setLoading(true); // Arama başladığında loading'i true yap
    try {
      const res = await api.search(debouncedQuery, { limit: 20 }); // Limit ayarlanabilir
      setSearchResults(res.data);
    } catch (error) {
      console.error('Error searching songs:', error);
    } finally {
      setLoading(false); // Arama tamamlandığında loading'i false yap
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-center mb-5 relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a song, artist or lyric..."
        className="p-2 border border-gray-300 rounded-lg w-3/4 lg:w-1/2"
      />
      {loading && (
        <ul
          ref={dropdownRef}
          className="absolute top-full mt-1 w-3/4 lg:w-1/2 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
        >
          {[...Array(5)].map((_, index) => (
            <li key={index} className="cursor-pointer p-2 flex items-center">
              <div className="skeleton skeleton-img"></div>
              <div className="flex flex-col w-full">
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && searchResults.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute top-full mt-1 w-3/4 lg:w-1/2 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
        >
          {searchResults.map((result) => (
            <li
              key={result.id}
              onClick={() => {
                onSongSelect(result);
                setSearchResults([]);
              }}
              className="cursor-pointer p-1 hover:bg-gray-200"
            >
              <div className="flex items-center">
                <img
                  src={result.image || BrokenImg}
                  alt={result.title}
                  className="w-20 h-20 object-cover rounded-lg mr-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = BrokenImg;
                  }}
                />
                <div>
                  <div className="font-semibold">{result.title}</div>
                  <div className="text-xs lg:text-base">{result.artist}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
