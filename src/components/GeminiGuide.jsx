import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // ✅ Import the Gemini SDK

const GeminiGuide = ({ code, onCodeUpdate }) => {
  const [suggestions, setSuggestions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // ✅ Load API Key

  const generateSuggestions = async () => {
    if (!code || code.trim().length < 10) {
      setSuggestions("Add more code to get AI suggestions...");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY); // ✅ Initialize API
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent([
        { role: "user", parts: [{ text: `Analyze this code and provide suggestions:\n${code}` }] }
      ]);
      const response = await result.response;
      const text = response.text();

      setSuggestions(text || "No suggestions found.");
      setGeneratedCode(code + "\n\n// ✨ AI Suggestion: " + text);
    } catch (err) {
      setError("Failed to get AI suggestions. Please try again.");
      console.error("Gemini API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (code) generateSuggestions();
    }, 1000);

    return () => clearTimeout(timer);
  }, [code]);

  const handleApplyChanges = () => {
    if (generatedCode && onCodeUpdate) {
      onCodeUpdate(generatedCode);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span role="img" aria-label="AI">💡</span> Gemini AI Assistant
        </h3>
        {isLoading ? (
          <div style={styles.loader}></div>
        ) : (
          <button 
            style={styles.refreshButton} 
            onClick={generateSuggestions}
            disabled={!code || code.trim().length < 10}
          >
            <span role="img" aria-label="refresh">🔄</span>
          </button>
        )}
      </div>

      <div style={styles.content}>
        {error ? (
          <div style={styles.error}>
            <span role="img" aria-label="error">⚠️</span> {error}
          </div>
        ) : suggestions ? (
          <>
            <div style={styles.suggestionsSection}>
              {suggestions.split('\n').map((line, i) => {
                if (line.startsWith('##')) {
                  return <h4 key={i} style={styles.sectionTitle}>{line.replace('##', '')}</h4>;
                } else if (line.startsWith('-')) {
                  return <p key={i} style={styles.listItem}>{line}</p>;
                } else {
                  return <p key={i} style={styles.paragraph}>{line}</p>;
                }
              })}
            </div>

            {generatedCode && (
              <div style={styles.actionSection}>
                <button 
                  style={styles.applyButton}
                  onClick={handleApplyChanges}
                >
                  Apply AI Suggestions
                </button>
                <div style={styles.codeDiff}>
                  <span style={styles.diffInfo}>
                    <span role="img" aria-label="info">ℹ️</span> AI has generated an improved version of your code
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={styles.placeholder}>
            <span role="img" aria-label="typing">⌨️</span> Start coding to get AI-powered suggestions
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1e1e1e",
    color: "#f0f0f0",
    height: "50%",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 15px",
    backgroundColor: "#333",
    borderBottom: "1px solid #444",
  },
  title: {
    margin: 0,
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  content: {
    padding: "15px",
    overflowY: "auto",
    flexGrow: 1,
  },
  sectionTitle: {
    marginTop: "8px",
    marginBottom: "4px",
    color: "#0078d7",
    fontSize: "15px",
  },
  listItem: {
    marginLeft: "15px",
    marginBottom: "6px",
    fontSize: "13px",
    position: "relative",
  },
  paragraph: {
    marginBottom: "10px",
    fontSize: "13px",
  },
  loader: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTopColor: "#0078d7",
    animation: "spin 1s linear infinite",
  },
  refreshButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#f0f0f0",
    cursor: "pointer",
    fontSize: "16px",
    padding: "3px 6px",
    borderRadius: "4px",
  },
  suggestionsSection: {
    marginBottom: "16px",
  },
  actionSection: {
    borderTop: "1px solid #444",
    paddingTop: "12px",
    marginTop: "16px",
  },
  applyButton: {
    backgroundColor: "#0078d7",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "12px",
  },
  codeDiff: {
    fontSize: "12px",
    color: "#aaa",
  },
  diffInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  error: {
    backgroundColor: "rgba(220, 53, 69, 0.2)",
    color: "#ff6b6b",
    padding: "10px 12px",
    borderRadius: "4px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  placeholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#aaa",
    fontSize: "14px",
    gap: "12px",
  },
};

export default GeminiGuide;
