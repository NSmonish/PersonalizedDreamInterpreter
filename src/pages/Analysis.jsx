import React, { useState } from "react";
import axios from "axios";

const Analysis = () => {
  const [dreamText, setDreamText] = useState("");
  const [emotion, setEmotion] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear the previous emotion before making a new prediction (optional step)
    setEmotion(null);

    try {
      const response = await axios.post("http://localhost:5001/analysis/api", {
        dreamText,
      });

      // Update the emotion state with the new response
      setEmotion(response.data.emotion);
    } catch (error) {
      console.error("Error predicting emotion:", error);
      setEmotion("Error detecting emotion.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Dream Emotion Analysis</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={dreamText}
          onChange={(e) => setDreamText(e.target.value)}
          placeholder="Describe your dream..."
          rows="6"
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "1rem",
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "0.7rem 1.5rem",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Analyze Emotion
        </button>
      </form>

      {emotion && (
        <div
          style={{ marginTop: "1.5rem", fontSize: "1.2rem", color: "#1a73e8" }}
        >
          Predicted Emotion: <strong>{emotion}</strong>
        </div>
      )}
    </div>
  );
};

export default Analysis;
