const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json()); // Parse JSON requests
app.use(cors()); // Allow frontend requests


const API_KEY = "VF.DM.67b105f95f14e8daf870a781.VmhLo9cX8l6tKTdM"; // Replace with your API Key
const PROJECT_ID = "67b0b6b4c3cc8dd9e212d81d"; // Replace with your Project ID
const USER_ID = "test_user_123";  // Unique ID for tracking the conversation
let isNewSession = true; // Track if this is a new session

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    if (isNewSession) {
      // Step 1: Reset the conversation to start at the beginning
      await fetch(`https://general-runtime.voiceflow.com/state/user/${USER_ID}`, {
        method: "DELETE",
        headers: {
          "Authorization": API_KEY,
          "Content-Type": "application/json"
        }
      });
      isNewSession = false; // Prevent resetting again in this session
    }

    // Step 2: Send user input after resetting
    const response = await fetch(`https://general-runtime.voiceflow.com/state/user/${USER_ID}/interact`, {
      method: "POST",
      headers: {
        "Authorization": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: { type: "text", payload: message }
      })
    });

    const data = await response.json();

    // console.log("Response Data:", data); // Add this to check the format of the response

    // Handle empty or malformed response

    if (data && data[0] && data[0].payload) {

      if (data[data.length - 1].type === 'end') {
        console.log(data)
        return res.json({ reply: "end" });
      }
      return res.json({ reply: data[0].payload?.message });
    }

    // Extract and display chatbot's response
    else {
      return res.json({ reply: "No response received." });
    }
  }
  catch (error) {
    // console.error("Error:", error);
    return res.status(500).json({ reply: "Server error" });
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}/chat`);
});
