import { useState, useEffect } from "react";
import "./App.css";
import { fetchReply } from "./fetchReply.jsx";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [pendingMessage, setPendingMessage] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedOption, setSelectedOption] = useState(null); // Track selected answer
  const [incorrectAnswers, setIncorrectAnswers] = useState([]); // Track wrong answers
  const [showExplanation, setShowExplanation] = useState(false); // Track if explanation should appear

  useEffect(() => {
    if (!pendingMessage) return;

    const getBotReply = async () => {
      const reply = await fetchReply(pendingMessage, setMessages); // 🔥 Fetch bot reply
      setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);

      // Show modal if bot response is "end"
      if (reply === "end") {
        console.log("BROOOOOOOOOO");
        setShowModal(true);
      }
    };

    getBotReply();
    setPendingMessage(null);
  }, [pendingMessage]);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setPendingMessage(input);
    }
  };

  const handleOptionClick = (option) => {
    if (option === "Phishing") {
      setShowExplanation(true);
    } else {
      setIncorrectAnswers((prev) => [...prev, option]); // Mark incorrect answer
    }
    setSelectedOption(option);
  };

  // Sample contact list (can be dynamic from API or state)
  const contacts = [
    { name: "Service Update", lastMessage: "GF3452S1", unread: 1 },
    { name: "Alice", lastMessage: "How are you?" },
    { name: "Bob", lastMessage: "Let's catch up soon." },
    { name: "Charlie", lastMessage: "Are you coming?", unread: 0 },
  ];

  const contact = {
    name: "Bestie",
    avatar: "👩‍💻", // Use emoji as avatar
  };

  return (
    <>
      <div className="chat-container">
        <div className="sidebar">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className={`contact-item ${
                selectedContact === contact ? "active" : ""
              }`}
            >
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="last-message">{contact.lastMessage}</div>
              </div>
              {contact.unread > 0 && (
                <span className="unread-badge">{contact.unread}</span>
              )}
            </div>
          ))}
        </div>
        <div>
          <div className="chat-box">
            <div className="chat-header">
              <div className="contact-avatar">{contact.avatar}</div>
              <div className="contact-name">{contact.name}</div>
            </div>
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
          <div className="input-box">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Send message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>
              You were hacked! What was the type of cybersecurity risk posed
              here?
            </h2>
            <div className="options">
              {["Phishing", "Ransomware", "Internet Of Things"].map(
                (option) => (
                  <div
                    key={option}
                    className={`option ${
                      selectedOption === option ? "selected" : ""
                    } ${incorrectAnswers.includes(option) ? "incorrect" : ""}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </div>
                )
              )}
            </div>

            {showExplanation && (
              <div className="explanation">
                <p>
                  <strong>Phishing</strong> is a type of scam where attackers
                  impersonate legitimate organizations or individuals to trick
                  you into revealing sensitive information (e.g., passwords,
                  credit card details) by posing as trustworthy sources. It
                  often comes through emails or messages, like the one described
                  in the question.
                </p>
                <a
                  href="https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more about phishing
                </a>
              </div>
            )}

            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
