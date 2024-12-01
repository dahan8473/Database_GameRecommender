import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export function Recommendations({ userId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStoredRecommendations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/recommendations/${userId}/stored`
      );
      setRecommendations(response.data);
      setLoading(false);
    } catch (err) {
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

  useEffect(() => {
    fetchStoredRecommendations();
  }, [userId]);

  if (loading) return <div>Loading recommendations...</div>;

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h2>AI Recommended Games</h2>
        <button
          onClick={generateNewRecommendations}
          className="generate-button"
          disabled={loading}
        >
          Generate New Recommendations
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="games-grid">
        {recommendations.map((rec) => (
          <div key={rec.recommendation_id} className="game-card">
            <h3>{rec.title}</h3>
            <p>Platform: {rec.platform}</p>
            <p>Publisher: {rec.publisher}</p>
            <p>Rating: {rec.average_rating?.toFixed(1) || "No ratings"}</p>
            {rec.reason && (
              <p className="recommendation-reason">Why: {rec.reason}</p>
            )}
            <button onClick={() => handleAddToWishlist(rec.game_id)}>
              Add to Wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
