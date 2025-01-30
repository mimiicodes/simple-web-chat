import React, {useState} from 'react'
import "./PromptPage.scss"
import { useNavigate } from 'react-router-dom'


const PromptPage = () => {
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (name.trim()) {
      navigate("/chatapp", { state: { name } });
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Enter Your Name</h1>
        <input
          type="text"
          className="input"
          placeholder="Your Name"
          name='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="submit-btn"
          disabled={!name.trim()}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default PromptPage