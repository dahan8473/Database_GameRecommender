import { useState, useEffect } from "react";
import axios from "axios";

export function GamesList({ userId, onAddToWishlist }) {
  const [popularGames, setPopularGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const [popularResponse, allResponse] = await Promise.all([
          axios.get("http://localhost:3000/videogame/popular"),
          axios.get("http://localhost:3000/videogame/all"),
        ]);
        setPopularGames(popularResponse.data);
        setAllGames(allResponse.data);
      } catch (err) {
        setError("Failed to fetch games");
      }
    };
    fetchGames();
  }, []);

  const handleAddToWishlist = async (gameId) => {
    try {
      await axios.post(`http://localhost:3000/wishlist/${userId}`, {
        game_id: gameId,
      });
      onAddToWishlist();
    } catch (err) {
      setError("Game is Already in Wishlist");
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
      {error && <div className="error-message">{error}</div>}

      <GameGrid games={popularGames} title="Popular Games" />
      <GameGrid games={allGames} title="All Games" />
    </div>
  );
}
