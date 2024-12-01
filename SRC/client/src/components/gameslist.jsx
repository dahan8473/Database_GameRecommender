import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export function GamesList({ userId, onAddToWishlist }) {
  const [popularGames, setPopularGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Fetch both popular and all games in parallel
        const [popularResponse, allResponse] = await Promise.all([
          axios.get("http://localhost:3000/videogame/popular"),
          axios.get("http://localhost:3000/videogame/all"),
        ]);

        setPopularGames(popularResponse.data);
        // Take only first 20 games
        setAllGames(allResponse.data.slice(0, 20));
      } catch (err) {
        setError("Failed to fetch games");
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    const searchGames = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/videogame/search`,
          {
            params: { query: searchTerm },
          }
        );
        setSearchResults(response.data);
      } catch (err) {
        setError("Failed to search games");
      }
      setIsSearching(false);
    };

    const debounceTimer = setTimeout(searchGames, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleAddToWishlist = async (gameId) => {
    try {
      await axios.post(`http://localhost:3000/wishlist/${userId}`, {
        game_id: gameId,
      });
      onAddToWishlist();
      toast.success("Game added to wishlist");
    } catch (err) {
      toast.error("Game is already in wishlist");
    }
  };

  const formatRating = (rating) => {
    if (!rating) return "No ratings";
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? "No ratings" : numRating.toFixed(1);
  };

  const GameGrid = ({ games, title }) => (
    <div className="game-section">
      <h2>{title}</h2>
      <div className="games-grid">
        {games.map((game) => (
          <div key={game.game_id} className="game-card">
            <h3>{game.title}</h3>
            <p>Platform: {game.platform}</p>
            <p>Publisher: {game.publisher}</p>
            <p>Rating: {formatRating(game.average_rating)}</p>
            <button onClick={() => handleAddToWishlist(game.game_id)}>
              Add to Wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="games-container">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search games by title, platform, or publisher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {isSearching ? (
        <div>Searching...</div>
      ) : searchTerm ? (
        <GameGrid
          games={searchResults}
          title={`Search Results${
            searchResults.length ? ` (${searchResults.length})` : ""
          }`}
        />
      ) : (
        <>
          <GameGrid games={popularGames} title="Popular Games" />
          <GameGrid games={allGames} title="All Games" />
        </>
      )}
    </div>
  );
}
