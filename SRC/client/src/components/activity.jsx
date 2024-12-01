import { useState, useEffect } from "react";
import axios from "axios";

export function Activity({ userId }) {
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/${userId}/activity`
        );
        setActivity(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch activity data");
        setLoading(false);
      }
    };

    fetchActivity();
  }, [userId]);

  const formatRating = (rating) => {
    if (!rating) return "No ratings";
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? "No ratings" : numRating.toFixed(1);
  };

  if (loading) return <div>Loading activity...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!activity) return <div>No activity found</div>;

  return (
    <div className="activity-container">
      <h2>Activity Summary</h2>
      <div className="activity-stats">
        <div className="stat-card">
          <i className="fa-solid fa-user"></i>
          <h3>Username</h3>
          <p>{activity.username}</p>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-star"></i>
          <h3>Total Ratings</h3>
          <p>{activity.total_ratings}</p>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-star-half-alt"></i>
          <h3>Average Rating Given</h3>
          <p>{formatRating(activity.average_rating)}</p>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-heart"></i>
          <h3>Wishlist Items</h3>
          <p>{activity.total_wishlist_items}</p>
        </div>
      </div>
    </div>
  );
}
