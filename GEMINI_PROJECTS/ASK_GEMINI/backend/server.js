const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || question.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: question,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      console.log("Gemini API Error:", errorData);

      return res.status(response.status).json({
        success: false,
        message: "Gemini API request failed",
      });
    }
    
    const data = await response.json();

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      return res.status(500).json({
        success: false,
        message: "No answer received from Gemini",
      });
    }

    res.json({
      success: true,
      answer: answer,
    });
    
  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
