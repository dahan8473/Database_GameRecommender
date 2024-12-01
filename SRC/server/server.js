const mysql = require("mysql2");
const cors = require("cors");
const express = require("express");
const path = require("path");
const OpenAI = require("openai");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

// i know there's a typo in the db name, i cant change it locally so fuck it
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "videogamereccomender",
});

// connect to openrouter
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL as ID", connection.threadId);
});

async function isAdmin(user_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM Admin";

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error checking admin status:", err.stack);
        reject(err);
        return;
      }

      // Check if user_id matches any admin_id in results
      const isAdminUser = results.some((admin) => admin.admin_id === user_id);
      resolve(isAdminUser);
    });
  });
}

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// endpoint to create a new user
app.post("/register", (req, res) => {
  const { username, password, age } = req.body;
  const registrationDate = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // Get the maximum user_id instead of counting rows
  const maxIdQuery = "SELECT MAX(user_id) AS max_id FROM User";
  connection.query(maxIdQuery, (err, results) => {
    if (err) {
      console.error("Error getting max user ID:", err.stack);
      res.status(500).send(`Error registering user: ${err.message}`);
      return;
    }

    const userId = (results[0].max_id || 0) + 1;

    const insertQuery =
      "INSERT INTO User (user_id, username, registration_date, age, password) VALUES (?, ?, ?, ?, ?)";
    connection.query(
      insertQuery,
      [userId, username, registrationDate, age, password],
      (err, results) => {
        if (err) {
          console.error("Error inserting user:", err.stack);
          res.status(500).send(`Error registering user: ${err.message}`);
          return;
        }
        res.status(201).send("User registered successfully");
      }
    );
  });
});

// endpoint to log in an existing user
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing credentials" });
  }

  // Query the database
  const query = "SELECT user_id FROM user WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    if (results.length > 0) {
      // User authenticated
      res.json({
        success: true,
        message: "Login successful",
        user_id: results[0].user_id,
      });
    } else {
      // Invalid credentials
      res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }
  });
});

// endpoint to retrieve all users in the db
app.get("/users", (req, res) => {
  const query = "SELECT * FROM User";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err.stack);
      res.status(500).send("Error fetching users");
      return;
    }
    res.status(200).json(results);
  });
});

// endpoint to update user information
app.put("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const { username, age, password } = req.body;

  // First check if user exists
  const checkUserQuery = "SELECT * FROM User WHERE user_id = ?";
  connection.query(checkUserQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error checking user:", err.stack);
      return res.status(500).send(`Error updating user: ${err.message}`);
    }

    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    // Build dynamic update query based on provided fields
    let updateQuery = "UPDATE User SET ";
    const updateValues = [];

    if (username) {
      updateQuery += "username = ?, ";
      updateValues.push(username);
    }
    if (age) {
      updateQuery += "age = ?, ";
      updateValues.push(age);
    }
    if (password) {
      updateQuery += "password = ?, ";
      updateValues.push(password);
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += " WHERE user_id = ?";
    updateValues.push(userId);

    // Execute update if there are fields to update
    if (updateValues.length > 1) {
      connection.query(updateQuery, updateValues, (err, results) => {
        if (err) {
          console.error("Error updating user:", err.stack);
          return res.status(500).send(`Error updating user: ${err.message}`);
        }
        res.status(200).send("User updated successfully");
      });
    } else {
      res.status(400).send("No fields to update provided");
    }
  });
});

// endpoint to show all user's activity, shows a summary of a user's ratings and wishlist contributions
app.get("/users/:userId/activity", (req, res) => {
  const userId = req.params.userId;

  // Check if user exists
  const checkUserQuery = "SELECT * FROM User WHERE user_id = ?";
  connection.query(checkUserQuery, [userId], (err, userResults) => {
    if (err) {
      console.error("Error checking user:", err.stack);
      return res
        .status(500)
        .send(`Error fetching user activity: ${err.message}`);
    }

    if (userResults.length === 0) {
      return res.status(404).send("User not found");
    }

    // Get ratings summary
    const ratingsQuery = `
      SELECT 
        COUNT(*) as total_ratings,
        AVG(score) as average_rating
      FROM Rating 
      WHERE user_id = ?`;

    // Get wishlist count
    const wishlistQuery = `
      SELECT COUNT(*) as total_wishlist
      FROM Wishlist 
      WHERE user_id = ?`;

    // Execute both queries in parallel
    Promise.all([
      new Promise((resolve, reject) => {
        connection.query(ratingsQuery, [userId], (err, ratingResults) => {
          if (err) reject(err);
          else resolve(ratingResults[0]);
        });
      }),
      new Promise((resolve, reject) => {
        connection.query(wishlistQuery, [userId], (err, wishlistResults) => {
          if (err) reject(err);
          else resolve(wishlistResults[0]);
        });
      }),
    ])
      .then(([ratingStats, wishlistStats]) => {
        const activitySummary = {
          user_id: userId,
          username: userResults[0].username,
          total_ratings: ratingStats.total_ratings || 0,
          average_rating: ratingStats.average_rating || 0,
          total_wishlist_items: wishlistStats.total_wishlist || 0,
        };
        res.status(200).json(activitySummary);
      })
      .catch((err) => {
        console.error("Error fetching activity:", err);
        res.status(500).send(`Error fetching activity: ${err.message}`);
      });
  });
});

// endpoint to retrieve a user's wishlist
app.get("/wishlist/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM Wishlist WHERE user_id = ?";
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching wishlist:", err.stack);
      res.status(500).send("Error fetching wishlist");
      return;
    }
    res.status(200).json(results);
  });
});

// endpoint to add a game to a user's wishlist
app.post("/wishlist/:userId", (req, res) => {
  const userId = req.params.userId;
  const { game_id, comment } = req.body; // Extract comment from request body

  // First verify user exists
  const checkUserQuery = "SELECT * FROM User WHERE user_id = ?";
  connection.query(checkUserQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error checking user:", err.stack);
      return res.status(500).send(`Error adding to wishlist: ${err.message}`);
    }

    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    // Check if game already in wishlist
    const checkWishlistQuery =
      "SELECT * FROM Wishlist WHERE user_id = ? AND game_id = ?";
    connection.query(checkWishlistQuery, [userId, game_id], (err, results) => {
      if (err) {
        console.error("Error checking wishlist:", err.stack);
        return res.status(500).send(`Error checking wishlist: ${err.message}`);
      }

      if (results.length > 0) {
        return res.status(409).send("Game already in wishlist");
      }

      // Add to wishlist with comment
      const insertQuery =
        "INSERT INTO Wishlist (user_id, game_id, comments) VALUES (?, ?, ?)";
      connection.query(
        insertQuery,
        [userId, game_id, comment || null],
        (err, results) => {
          if (err) {
            console.error("Error adding to wishlist:", err.stack);
            return res
              .status(500)
              .send(`Error adding to wishlist: ${err.message}`);
          }

          res.status(201).send("Game added to wishlist successfully");
        }
      );
    });
  });
});

// endpoint to delete a game from user's wishlist
app.delete("/wishlist/:userId/:gameId", (req, res) => {
  const { userId, gameId } = req.params;

  const query = "DELETE FROM Wishlist WHERE user_id = ? AND game_id = ?";
  connection.query(query, [userId, gameId], (err, results) => {
    if (err) {
      console.error("Error deleting from wishlist:", err);
      return res.status(500).send("Error deleting from wishlist");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Game not found in wishlist");
    }
    res.status(200).send("Game removed from wishlist");
  });
});

// endpoint to find a videogame based on id
app.get("/videogame/search/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM VideoGame WHERE game_id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error while fetching the game:", err);
      res.status(500).send("Error while fetching the game");
    } else if (results.length === 0) {
      res.status(404).send("Game not found");
    } else {
      res.status(200).json(results[0]); // Return the first matching result
    }
  });
});

// endpoint to retrieve all video games
app.get("/videogame/all", (req, res) => {
  const query = `
    SELECT 
      v.game_id,
      v.title,
      v.platform,
      v.publisher,
      v.release_date,
      AVG(r.score) as average_rating,
      COUNT(r.rating_id) as number_of_ratings
    FROM VideoGame v
    LEFT JOIN Rating r ON v.game_id = r.game_id
    GROUP BY v.game_id, v.title, v.platform, v.publisher, v.release_date
    ORDER BY v.title`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching all games:", err);
      return res.status(500).send("Error fetching all games");
    }
    res.status(200).json(results);
  });
});

// endpoint to get most popular games
app.get("/videogame/popular", (req, res) => {
  // number of results to return
  const { n } = req.body;

  // Validate n
  const limit = n || 10; // Default to 10 if not specified

  const query = `
    SELECT 
      v.game_id,
      v.title,
      v.platform,
      v.publisher,
      v.release_date,
      AVG(r.score) as average_rating,
      COUNT(r.rating_id) as number_of_ratings
    FROM VideoGame v
    LEFT JOIN Rating r ON v.game_id = r.game_id
    GROUP BY v.game_id, v.title, v.platform, v.publisher, v.release_date
    HAVING number_of_ratings > 0
    ORDER BY average_rating DESC, number_of_ratings DESC
    LIMIT ?`;

  connection.query(query, [limit], (err, results) => {
    if (err) {
      console.error("Error fetching popular games:", err);
      return res.status(500).send("Error fetching popular games");
    }

    if (results.length === 0) {
      return res.status(404).send("No games found");
    }

    res.status(200).json(results);
  });
});

// endpoint to search video games
app.get("/videogame/search", (req, res) => {
  const { query } = req.query;

  const searchQuery = `
    SELECT 
      v.game_id,
      v.title,
      v.platform,
      v.publisher,
      v.release_date,
      AVG(r.score) as average_rating,
      COUNT(r.rating_id) as number_of_ratings
    FROM VideoGame v
    LEFT JOIN Rating r ON v.game_id = r.game_id
    WHERE 
      v.title LIKE ? OR
      v.platform LIKE ? OR
      v.publisher LIKE ?
    GROUP BY v.game_id, v.title, v.platform, v.publisher, v.release_date
    ORDER BY v.title`;

  const searchTerm = `%${query}%`;

  connection.query(
    searchQuery,
    [searchTerm, searchTerm, searchTerm],
    (err, results) => {
      if (err) {
        console.error("Error searching games:", err);
        return res.status(500).send("Error searching games");
      }
      res.status(200).json(results);
    }
  );
});

// endpoint to get games with rating >= specified score
app.get("/videogame/byrating/:score", (req, res) => {
  const { score } = req.params;
  const query = `
    SELECT 
      v.game_id,
      v.title,
      v.platform,
      v.publisher,
      v.release_date,
      AVG(r.score) as average_rating,
      COUNT(r.rating_id) as number_of_ratings
    FROM VideoGame v
    INNER JOIN Rating r ON v.game_id = r.game_id
    GROUP BY v.game_id, v.title, v.platform, v.publisher, v.release_date
    HAVING AVG(r.score) >= ?
    ORDER BY average_rating DESC`;

  connection.query(query, [score], (err, results) => {
    if (err) {
      console.error("Error fetching games by rating:", err);
      res.status(500).send("Error fetching games by rating");
    } else if (results.length === 0) {
      res.status(404).send("No games found with rating >= " + score);
    } else {
      res.status(200).json(results);
    }
  });
});

// admin endpoint to delete a user
app.delete("/admin/users/:userId", (req, res) => {
  const { userId } = req.params;
  const { admin_id } = req.body;

  // check if user is an admin
  isAdmin(admin_id)
    .then((isAdminUser) => {
      if (!isAdminUser) {
        return res.status(401).send("Unauthorized");
      }

      // check if user exists
      const checkUserQuery = "SELECT * FROM User WHERE user_id = ?";
      connection.query(checkUserQuery, [userId], (err, results) => {
        if (err) {
          console.error("Error checking user:", err.stack);
          return res.status(500).send(`Error deleting user: ${err.message}`);
        }

        if (results.length === 0) {
          return res.status(404).send("User not found");
        }

        // delete user
        const deleteQuery = "DELETE FROM User WHERE user_id = ?";
        connection.query(deleteQuery, [userId], (err, results) => {
          if (err) {
            console.error("Error deleting user:", err.stack);
            return res.status(500).send(`Error deleting user: ${err.message}`);
          }
          res.status(200).send("User deleted successfully");
        });
      });
    })
    .catch((err) => {
      console.error("Error checking admin status:", err);
      res.status(500).send("Error checking admin status");
    });
});

// get stored recommendations
app.get("/recommendations/:userId/stored", async (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT r.recommendation_id, r.reason, v.*, AVG(rt.score) as average_rating
    FROM Recommendation r
    JOIN VideoGame v ON r.game_id = v.game_id
    LEFT JOIN Rating rt ON v.game_id = rt.game_id
    WHERE r.user_id = ?
    GROUP BY r.recommendation_id, r.reason, v.game_id`;

  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(query, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    res.json(results);
  } catch (err) {
    console.error("Error fetching stored recommendations:", err);
    res.status(500).send("Error fetching recommendations");
  }
});

// generate new recommendations
app.post("/recommendations/:userId/generate", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Get user's wishlist games
    const wishlistQuery = `
      SELECT v.* 
      FROM VideoGame v
      INNER JOIN Wishlist w ON v.game_id = w.game_id
      WHERE w.user_id = ?`;

    const allGamesQuery = `
      SELECT v.*, AVG(r.score) as average_rating
      FROM VideoGame v
      LEFT JOIN Rating r ON v.game_id = r.game_id
      WHERE v.game_id NOT IN (
        SELECT game_id FROM Wishlist WHERE user_id = ?
      )
      GROUP BY v.game_id`;

    const [wishlistGames, allGames] = await Promise.all([
      new Promise((resolve, reject) => {
        connection.query(wishlistQuery, [userId], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        connection.query(allGamesQuery, [userId], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }),
    ]);

    // Get AI recommendations using existing logic
    const prompt = `As a video game recommendation system, analyze these wishlist games:
      ${JSON.stringify(
        wishlistGames.map((g) => ({
          title: g.title,
          platform: g.platform,
          publisher: g.publisher,
        }))
      )}
      
      From this list of available games:
      ${JSON.stringify(
        allGames.map((g) => ({
          title: g.title,
          platform: g.platform,
          publisher: g.publisher,
        }))
      )}
      
      Return EXACTLY 5 recommendations in this JSON format, nothing else:
      [
        {"title": "Exact Game Title", "reason": "Short reason for recommendation in relation to games within user wishlist"},
        {"title": "Exact Game Title", "reason": "Short reason for recommendation in relation to games within user wishlist"}
      ]`;

    const completion = await openrouter.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct:free",
      messages: [
        {
          role: "system",
          content:
            "You are a JSON-only response engine. Always respond with valid JSON arrays containing objects with 'title' and 'reason' fields.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });
    let recommendations = JSON.parse(completion.choices[0].message.content);

    // Get max recommendation_id
    const maxIdQuery =
      "SELECT MAX(recommendation_id) as max_id FROM Recommendation";
    const maxId = await new Promise((resolve, reject) => {
      connection.query(maxIdQuery, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].max_id || 0);
      });
    });

    // Store new recommendations
    let nextId = maxId + 1;
    const insertPromises = recommendations
      .map(async (rec) => {
        const game = allGames.find((g) => g.title === rec.title);
        if (game) {
          const insertQuery = `
          INSERT INTO Recommendation 
          (recommendation_id, user_id, game_id, reason) 
          VALUES (?, ?, ?, ?)`;

          return new Promise((resolve, reject) => {
            connection.query(
              insertQuery,
              [nextId++, userId, game.game_id, rec.reason],
              (err, results) => {
                if (err) reject(err);
                else resolve({ ...game, reason: rec.reason });
              }
            );
          });
        }
      })
      .filter(Boolean);

    const storedRecommendations = await Promise.all(insertPromises);
    res.json(storedRecommendations);
  } catch (err) {
    console.error("Error generating recommendations:", err);
    res.status(500).send("Error generating recommendations");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
