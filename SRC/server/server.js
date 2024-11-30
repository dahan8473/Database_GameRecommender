const mysql = require("mysql2");
const cors = require("cors");
const express = require("express");
const path = require("path");
const { info } = require("console");
const app = express();
app.use(cors());
app.use(express.json());

// i know there's a typo in the db name, i cant change it locally so fuck it
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "videogamereccomender",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL as ID", connection.threadId);
});

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

  const countQuery = "SELECT COUNT(*) AS count FROM User";
  connection.query(countQuery, (err, results) => {
    if (err) {
      console.error("Error counting users:", err.stack);
      res.status(500).send(`Error registering user: ${err.message}`);
      return;
    }

    const userId = results[0].count + 1;

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
