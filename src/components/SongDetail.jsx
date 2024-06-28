import React from 'react';
import BrokenImg from '../assets/broken-image.png';

const SongDetail = ({ song, lyrics, loading }) => {
  return (
    <div className="mt-5 bg-white shadow-md rounded-lg p-4 lg:w-1/2" >
      <div className="flex space-x-4">
        <img
          src={song.image || BrokenImg}
          alt={song.title}
          className="w-28 h-28 lg:w-44 lg:h-44 object-cover rounded-lg items-center"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = BrokenImg;
          }}
        />
        <div>
          <h3 className="text-2xl lg:text-4xl font-bold mb-3">{song.title}</h3>
          <h3 className="text-md lg:text-3xl font-semibold">{song.artist}</h3>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          {/* Loading animation */}
          <div class="animation">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : (
        <pre className="whitespace-pre-wrap lg:mt-4 mt-1">{lyrics}</pre>
      )}
    </div>
  );
};

export default SongDetail;
