import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export function Recommendations({ userId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const fetchStoredRecommendations = async (rating = minRating) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/recommendations/${userId}/stored`,
        {
          params: { minRating: rating },
        }
      );
      setRecommendations(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch stored recommendations");
      setLoading(false);
    }
  };

  const generateNewRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `http://localhost:3000/recommendations/${userId}/generate`
      );
      setRecommendations(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to generate new recommendations");
      setLoading(false);
    }
  };

  const handleDeleteRecommendation = async (recommendationId) => {
    try {
      await axios.delete(
        `http://localhost:3000/recommendations/${userId}/${recommendationId}`
      );
      setRecommendations(
        recommendations.filter(
          (rec) => rec.recommendation_id !== recommendationId
        )
      );
      toast.success("Recommendation removed");
    } catch (err) {
      toast.error("Failed to remove recommendation");
    }
  };

  const handleAddToWishlist = async (gameId) => {
    try {
      await axios.post(`http://localhost:3000/wishlist/${userId}`, {
        game_id: gameId,
      });
      setRecommendations(
        recommendations.filter((rec) => rec.game_id !== gameId)
      );
      toast.success("Game added to wishlist");
    } catch (err) {
      toast.error("Failed to add game to wishlist");
    }
  };

  const formatRating = (rating) => {
    if (!rating) return "No ratings";
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? "No ratings" : numRating.toFixed(1);
  };

  useEffect(() => {
    fetchStoredRecommendations();
  }, [userId]);

  if (loading) return <div>Loading recommendations...</div>;

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h2>AI Recommended Games</h2>
        <div className="filter-controls">
          <label>
            Minimum Rating:
            <select
              value={minRating}
              onChange={(e) => {
                setMinRating(Number(e.target.value));
                fetchStoredRecommendations(Number(e.target.value));
              }}
            >
              <option value="0">All Ratings</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5 Only</option>
            </select>
          </label>
          <button
            onClick={generateNewRecommendations}
            className="generate-button"
            disabled={loading}
          >
            Generate New Recommendations
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!loading && recommendations.length === 0 ? (
        <div className="welcome-message">
          <i className="fa-solid fa-robot welcome-icon"></i>
          <h2>No Recommendations Yet</h2>
          <p>Add games to your wishlist to get personalized recommendations!</p>
          <div className="suggested-actions">
            <p>Follow these steps:</p>
            <ul>
              <li>
                <i className="fa-solid fa-heart"></i> Add games to your wishlist
              </li>
              <li>
                <i className="fa-solid fa-star"></i> Rate games you've played
              </li>
              <li>
                <i className="fa-solid fa-wand-magic-sparkles"></i> Click
                "Generate New Recommendations"
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="games-grid">
          {recommendations
            .filter((rec) => rec !== null && rec.title)
            .map((rec) => (
              <div key={rec.recommendation_id} className="game-card">
                <h3>{rec.title}</h3>
                <p>Platform: {rec.platform}</p>
                <p>Publisher: {rec.publisher}</p>
                <p>Rating: {formatRating(rec.average_rating)}</p>
                {rec.reason && (
                  <p className="recommendation-reason">Why: {rec.reason}</p>
                )}
                <div className="button-row">
                  <button
                    onClick={() => handleAddToWishlist(rec.game_id)}
                    title="Add to Wishlist"
                  >
                    <i className="fa-solid fa-heart"></i>
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteRecommendation(rec.recommendation_id)
                    }
                    title="Remove Recommendation"
                    className="delete-rec-button"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
