import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ratingFormStars = [1, 2, 3, 4, 5].map((num) => ({
  value: num,
  label: `${num} ${num === 1 ? "Star" : "Stars"}`,
}));

export function GamesList({ userId, onAddToWishlist }) {
  const [popularGames, setPopularGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeGame, setActiveGame] = useState({
    id: null,
    showRatingForm: false,
    showRatings: false,
    ratings: [],
    ratingScore: 0,
    ratingReview: "",
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const [popularResponse, allResponse] = await Promise.all([
          axios.get("http://localhost:3000/videogame/popular"),
          axios.get("http://localhost:3000/videogame/all"),
        ]);
        setPopularGames(popularResponse.data.slice(0, 6));
        setAllGames(allResponse.data);
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

  const handleRateGame = async (gameId, score, review) => {
    try {
      await axios.post(`http://localhost:3000/rating/${userId}/${gameId}`, {
        score,
        review,
      });
      toast.success("Rating submitted successfully");
      setActiveGame((prev) => ({
        ...prev,
        showRatingForm: false,
        ratingScore: 0,
        ratingReview: "",
      }));
    } catch (err) {
      toast.error("Failed to submit rating");
    }
  };

  const handleViewRatings = async (gameId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/ratings/game/${gameId}`
      );
      setActiveGame((prev) => ({
        ...prev,
        id: gameId,
        showRatings: true,
        ratings: response.data,
      }));
    } catch (err) {
      toast.error("Failed to fetch ratings");
    }
  };

  const formatRating = (rating) => {
    if (!rating) return "No ratings";
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? "No ratings" : numRating.toFixed(1);
  };

  const RatingForm = ({ gameId, onClose }) => {
    const [localState, setLocalState] = useState({
      score: activeGame.ratingScore,
      review: activeGame.ratingReview,
    });

    const handleSubmit = () => {
      handleRateGame(gameId, localState.score, localState.review);
    };

    const handleReviewChange = (e) => {
      setLocalState((prev) => ({
        ...prev,
        review: e.target.value,
      }));
    };

    const handleScoreChange = (e) => {
      setLocalState((prev) => ({
        ...prev,
        score: Number(e.target.value),
      }));
    };

    return (
      <div className="rating-form">
        <select value={localState.score} onChange={handleScoreChange}>
          <option value="0">Select Rating</option>
          {ratingFormStars.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Write a review (optional)"
          value={localState.review}
          onChange={handleReviewChange}
        />
        <div className="button-row">
          <button onClick={handleSubmit} disabled={!localState.score}>
            <i className="fa-solid fa-check"></i>
            Submit
          </button>
          <button onClick={onClose}>
            <i className="fa-solid fa-times"></i>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Game card component
  const GameCard = ({ game }) => (
    <div className="game-card">
      <h3>{game.title}</h3>
      <p>Platform: {game.platform}</p>
      <p>Publisher: {game.publisher}</p>
      <p>Rating: {formatRating(game.average_rating)}</p>

      {activeGame.showRatingForm && activeGame.id === game.game_id && (
        <RatingForm
          gameId={game.game_id}
          onClose={() =>
            setActiveGame((prev) => ({
              ...prev,
              showRatingForm: false,
              ratingScore: 0,
              ratingReview: "",
            }))
          }
        />
      )}

      {activeGame.showRatings && activeGame.id === game.game_id && (
        <div className="ratings-list">
          <h4>User Ratings</h4>
          {Array.isArray(activeGame.ratings) &&
          activeGame.ratings.length > 0 ? (
            activeGame.ratings.map((rating) => (
              <div key={rating.rating_id} className="rating-item">
                <div className="rating-header">
                  <span className="rating-score">
                    <i className="fa-solid fa-star"></i> {rating.score}/5
                  </span>
                  <span className="rating-user">
                    <i className="fa-solid fa-user"></i> {rating.username}
                  </span>
                  <span className="rating-date">
                    {new Date(rating.rating_date).toLocaleDateString()}
                  </span>
                </div>
                {rating.review && (
                  <p className="rating-review">"{rating.review}"</p>
                )}
              </div>
            ))
          ) : (
            <p className="no-ratings">No ratings yet</p>
          )}
          <button
            onClick={() =>
              setActiveGame((prev) => ({ ...prev, showRatings: false }))
            }
            className="close-ratings-button"
          >
            Close Ratings
          </button>
        </div>
      )}

      <div className="button-row">
        <button
          onClick={() => handleAddToWishlist(game.game_id)}
          title="Add to Wishlist"
        >
          <i className="fa-solid fa-heart"></i>
        </button>
        <button
          onClick={() =>
            setActiveGame({
              id: game.game_id,
              showRatingForm: true,
              showRatings: false,
              ratings: [],
              ratingScore: 0,
              ratingReview: "",
            })
          }
          title="Rate Game"
        >
          <i className="fa-solid fa-star"></i>
        </button>
        <button
          onClick={() => handleViewRatings(game.game_id)}
          title="View Ratings"
        >
          <i className="fa-solid fa-comments"></i>
        </button>
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
        <div className="game-section">
          <h2>
            Search Results{" "}
            {searchResults.length ? `(${searchResults.length})` : ""}
          </h2>
          <div className="games-grid">
            {searchResults.map((game) => (
              <GameCard key={game.game_id} game={game} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="game-section">
            <h2>Popular Games</h2>
            <div className="games-grid">
              {popularGames.map((game) => (
                <GameCard key={game.game_id} game={game} />
              ))}
            </div>
          </div>
          <div className="game-section">
            <h2>Games</h2>
            <div className="games-grid">
              {allGames.map((game) => (
                <GameCard key={game.game_id} game={game} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
