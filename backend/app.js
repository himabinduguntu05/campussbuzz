const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json()); // To parse JSON request body
app.use(cors()); // To allow frontend requests

// Sample API Endpoint
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
