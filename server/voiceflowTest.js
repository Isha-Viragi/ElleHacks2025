const express = require('express');
const app = express();
app.use(express.json());

app.post('/voiceflow-webhook', (req, res) => {
  const userMessage = req.body.message;
  console.log("Received from Voiceflow:", userMessage);

  // Process data and return response
  res.json({ reply: "Got it! Processing..." });
});

app.listen(3000, () => console.log('Server running on port 3000'));
