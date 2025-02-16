export const fetchReply = async (message) => {
  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    return data.reply; // Return the bot's reply
  } catch (error) {
    console.error("Error:", error);
    return "Error connecting to server.";
  }
};
