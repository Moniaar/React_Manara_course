// App.jsx
import { useState } from "react";

function Sidebar({ favorites, showSidebar, toggleSidebar }) {
  return (
    <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 z-50 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} w-64`}>
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Favorites</h2>
        <button onClick={toggleSidebar} className="text-gray-600 dark:text-gray-300">&times;</button>
      </div>
      <ul className="p-4 space-y-2 overflow-y-auto h-full">
        {favorites.length === 0 && <li className="text-gray-500 dark:text-gray-400">No favorites yet.</li>}
        {favorites.map(fav => (
          <li key={fav.mal_id} className="text-gray-800 dark:text-white border-b pb-2">
            {fav.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [manga, setManga] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const searchManga = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setManga(null);

    try {
      const response = await fetch(`https://api.jikan.moe/v4/manga?q=${query}&limit=1`);
      const data = await response.json();

      if (!data.data.length) {
        throw new Error("No manga found for the given title.");
      }

      setManga(data.data[0]);
    } catch (err) {
      setError(err.message || "Failed to fetch manga.");
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = () => {
    if (manga && !favorites.find(fav => fav.mal_id === manga.mal_id)) {
      setFavorites([...favorites, manga]);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen flex flex-col items-center p-4`}>
      <Sidebar favorites={favorites} showSidebar={showSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} />

      <div className="w-full flex justify-between items-center max-w-md mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowSidebar(!showSidebar)} className="text-black dark:text-white text-2xl">
            ♡
          </button>
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Manga Lookup</h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 border rounded text-sm"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Manga Title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded w-72 text-black"
        />
        <button
          onClick={searchManga}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-600 dark:text-gray-300">Loading...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {manga && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 w-full max-w-md mt-4">
          <img
            src={manga.images.jpg.image_url}
            alt={manga.title}
            className="w-full rounded mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{manga.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{manga.synopsis}</p>
          <div className="mt-4 text-sm">
            <p>Status: <strong>{manga.status}</strong></p>
            <p>Chapters: <strong>{manga.chapters || 'N/A'}</strong></p>
            <p>Score: <strong>{manga.score || 'N/A'}</strong></p>
          </div>
          <button
            onClick={addToFavorites}
            className="mt-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Add to Favorites
          </button>
        </div>
      )}
    </div>
  );
}

