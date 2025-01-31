import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import './ChatApp.scss';
import avatar1 from "../assets/images/avatar1.png";
import avatar2 from "../assets/images/avatar2.png";

const ChatApp = () => {
  const [nameInp, setNameInp] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [page, setPage] = useState(1);
  const chatBodyRef = useRef(null);
  const pageSize = 25;

  useEffect(() => {
    const storedName = prompt("Enter your name:") || "User";
    setNameInp(storedName);

    const savedMessages = JSON.parse(localStorage.getItem(`messages_${storedName}`)) || [];

    if (savedMessages.length === 0) {
      const initialMessage = { sender: "System", text: `Hello ${storedName}`, type: "received"};
      const updatedMessages = [initialMessage];
      localStorage.setItem(`messages_${storedName}`, JSON.stringify(updatedMessages));
      setMessages(updatedMessages.slice(-pageSize));
    } else {
      setMessages(savedMessages.slice(-pageSize));
    }
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key.startsWith("messages_")) {
        const newMessages = JSON.parse(event.newValue);
        setMessages(newMessages.slice(-page * pageSize));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [page]);

  useEffect(() => {
    const channel = new BroadcastChannel("chat");
    channel.onmessage = (event) => {
      const newMessages = event.data;
      setMessages(newMessages.slice(-page * pageSize));
    };
    return () => channel.close();
  }, [page]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = { sender: nameInp, text: inputText, type: "sent" };
      const updatedMessages = [...messages, newMessage];
      localStorage.setItem(`messages_${nameInp}`, JSON.stringify(updatedMessages));

      setMessages(updatedMessages.slice(-pageSize));
      setInputText("");
      setPage(1);
      const channel = new BroadcastChannel("chat");
      channel.postMessage(updatedMessages);
      channel.close();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const loadMoreMessages = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <Icon icon="mdi:arrow-left" className="back-icon" />
        <div className="profile">
          <img src={avatar2} alt="Profile" className="avatar" />
          <div className="name-status">
            <h4>Anna Lena</h4>
            <span className="status">● Online</span>
          </div>
        </div>
        <Icon icon="mdi:dots-vertical" className="menu-icon" />
      </div>
      <div
        className="chat-body"
        ref={chatBodyRef}
        onScroll={(e) => {
          if (e.target.scrollTop <= 10) {
            loadMoreMessages();
          }
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.type}`}>
            {msg.type === "received" && <img src={avatar1} alt="Receiver" className="chat-avatar" />}
            <div className="chat-message">
              {msg.img ? <img src={msg.img} alt="Sent" className="chat-image" /> : <p>{msg.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <label className="file-upload">
          <Icon icon="clarity:attachment-line" />
          <input type="file" name="file" />
        </label>
        <input
          type="text"
          placeholder="Your message..."
          value={inputText}
          name="text"
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Icon icon="mdi:gif" className="icon" />
        <Icon icon="mdi:emoticon-outline" className="icon" />
        <Icon icon="mdi:send" className="send-icon" onClick={handleSend} />
      </div>
    </div>
  );
}
export default ChatApp;