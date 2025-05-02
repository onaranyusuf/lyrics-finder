import axios from "axios";

const API_URL = "https://genius-unofficial-api.vercel.app/api";
const LYRICS_OVH_URL = "https://api.lyrics.ovh/v1";

export const getCORSImage = async (url) => {
  try {
    const res = await axios.get(`${API_URL}/cors?url=${encodeURIComponent(url)}`);
    return res;
  } catch (error) {
    console.error("Error fetching CORS image:", error);
    throw error;
  }
};

export const upload = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const res = await axios.post(`${API_URL}/upload`, formData);
    return res;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const getLyrics = async (artist, title) => {
  try {
    if (!artist || !title) {
      throw new Error(`Artist and title are required. Received: artist=${artist}, title=${title}`);
    }
    const encodedArtist = encodeURIComponent(artist.trim());
    const encodedTitle = encodeURIComponent(title.trim());
    const url = `${LYRICS_OVH_URL}/${encodedArtist}/${encodedTitle}`;
    console.log("Fetching lyrics from:", url);
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(`Error fetching lyrics for ${artist} - ${title}:`, error);
    throw error;
  }
};

export const getColors = async (url) => {
  try {
    const res = await axios.get(`${API_URL}/song/colors`, { params: { url } });
    return res;
  } catch (error) {
    console.error("Error fetching colors:", error);
    throw error;
  }
};

export const search = async (query) => {
  try {
    const res = await axios.get(`${API_URL}/search`, { params: { query } });
    return res;
  } catch (error) {
    console.error("Error searching:", error);
    throw error;
  }
};

export default {
  getCORSImage,
  getLyrics,
  upload,
  getColors,
  search,
};