import { useState, useEffect } from "react";
import axios from "axios";

export function Wishlist({ userId }) {
  const [wishlist, setWishlist] = useState([]);
  const [games, setGames] = useState({});
  const [error, setError] = useState("");

  const fetchGameDetails = async (gameId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/videogame/search/${gameId}`
      );
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch game ${gameId}:`, err);
      return null;
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/wishlist/${userId}`
      );
      setWishlist(response.data);

      // Fetch game details for each wishlist item
      const gameDetails = {};
      await Promise.all(
        response.data.map(async (item) => {
          const game = await fetchGameDetails(item.game_id);
          if (game) {
            gameDetails[item.game_id] = game;
          }
        })
      );
      setGames(gameDetails);
    } catch (err) {
      setError("Failed to fetch wishlist");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  return (
    <div className="wishlist-container">
      <h2>My Wishlist</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div key={item.game_id} className="wishlist-item">
            {games[item.game_id] ? (
              <>
                <h3>{games[item.game_id].title}</h3>
                <p>Platform: {games[item.game_id].platform}</p>
                <p>Publisher: {games[item.game_id].publisher}</p>
                <p>
                  Release Date:{" "}
                  {new Date(
                    games[item.game_id].release_date
                  ).toLocaleDateString()}
                </p>
                {item.comments && <p>Notes: {item.comments}</p>}
              </>
            ) : (
              <p>Loading game details...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
