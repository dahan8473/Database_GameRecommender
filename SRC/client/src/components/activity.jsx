import { useState, useEffect } from "react";
import axios from "axios";

export function Activity({ userId }) {
  const [activity, setActivity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }

        setLoading(true);
        const [activityResponse, reviewsResponse] = await Promise.all([
          axios.get(`http://localhost:3000/users/${userId}/activity`),
          axios.get(`http://localhost:3000/users/${userId}/reviews`),
        ]);

        if (
          activityResponse.data.total_ratings === 0 &&
          activityResponse.data.total_wishlist_items === 0
        ) {
          setActivity(null);
        } else {
          setActivity(activityResponse.data);
        }
        setReviews(reviewsResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const formatRating = (rating) => {
    if (!rating) return "No ratings";
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? "No ratings" : numRating.toFixed(1);
  };

  if (loading) return <div>Loading activity...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!activity || !userId) {
    return (
      <div className="activity-container">
        <div className="welcome-message">
          <i className="fa-solid fa-gamepad welcome-icon"></i>
          <h2>Welcome to Gamefolio!</h2>
          <p>
            Start rating games and adding them to your wishlist to see your
            activity stats here.
          </p>
          <div className="suggested-actions">
            <p>Try these actions to get started:</p>
            <ul>
              <li>
                <i className="fa-solid fa-star"></i> Rate some games you've
                played
              </li>
              <li>
                <i className="fa-solid fa-heart"></i> Add games to your wishlist
              </li>
              <li>
                <i className="fa-solid fa-wand-magic-sparkles"></i> Get
                personalized recommendations
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="reviews-section">
        <h2>My Reviews</h2>
        {reviews.length > 0 ? (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.rating_id} className="review-card">
                <div className="review-header">
                  <h3>{review.title}</h3>
                  <span className="review-score">
                    <i className="fa-solid fa-star"></i> {review.score}/5
                  </span>
                </div>
                <div className="review-details">
                  <p className="review-platform">
                    <i className="fa-solid fa-gamepad"></i> {review.platform}
                  </p>
                  <p className="review-publisher">
                    <i className="fa-solid fa-building"></i> {review.publisher}
                  </p>
                  <p className="review-date">
                    <i className="fa-solid fa-calendar"></i>{" "}
                    {new Date(review.rating_date).toLocaleDateString()}
                  </p>
                </div>
                <p className="review-text">"{review.review}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">
            No reviews yet. Start rating games to see them here!
          </p>
        )}
      </div>
    </div>
  );
}
