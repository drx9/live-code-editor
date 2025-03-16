import React, { useState, useEffect } from "react";
import CodeEditor from "./components/CodeEditor";
import TerminalComponent from "./components/TerminalComponent";
import FileManager from "./components/FileManager";
import GeminiGuide from "./components/GeminiGuide";

function App() {
  const [code, setCode] = useState(localStorage.getItem("savedCode") || ""); 
  const [installedPackages, setInstalledPackages] = useState(
    JSON.parse(localStorage.getItem("installedPackages")) || []
  );
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isTerminalFocused, setIsTerminalFocused] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // ✅ Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div style={styles.container(theme)}>
      {/* Status Bar */}
      <div style={styles.statusBar(theme)}>
        <div style={styles.statusSection}>
          <span style={styles.statusItem}>Line: 1</span>
          <span style={styles.statusItem}>Col: 1</span>
        </div>
        <div style={styles.statusSection}>
          <button style={styles.themeToggle(theme)} onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.fileManager(theme)}>
          <FileManager theme={theme} installedPackages={installedPackages} />
        </div>

        <div style={styles.editor(theme)}>
          <CodeEditor theme={theme} setCode={setCode} code={code} onCodeChange={setCode} />
        </div>

        <div style={styles.rightPanel(theme)}>
          <GeminiGuide theme={theme} code={code} />
          <TerminalComponent theme={theme} />
        </div>
      </div>
    </div>
  );
}

// ✅ Pass `theme` dynamically
const styles = {
  container: (theme) => ({
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
    color: theme === "dark" ? "#f0f0f0" : "#000000",
  }),
  statusBar: (theme) => ({
    display: "flex",
    justifyContent: "space-between",
    padding: "8px",
    backgroundColor: theme === "dark" ? "#007acc" : "#d4d4d4",
    color: theme === "dark" ? "white" : "black",
  }),
  themeToggle: (theme) => ({
    padding: "4px 8px",
    backgroundColor: theme === "dark" ? "#444" : "#ddd",
    color: theme === "dark" ? "#fff" : "#000",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  }),
  mainContent: {
    display: "flex",
    flex: 1,
  },
  fileManager: (theme) => ({
    width: "200px",
    backgroundColor: theme === "dark" ? "#252526" : "#f5f5f5",
    borderRight: theme === "dark" ? "1px solid #3c3c3c" : "1px solid #ccc",
  }),
  editor: (theme) => ({
    flex: 1,
    backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
  }),
  rightPanel: (theme) => ({
    width: "300px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme === "dark" ? "#252526" : "#f5f5f5",
    borderLeft: theme === "dark" ? "1px solid #3c3c3c" : "1px solid #ccc",
  }),
};

export default App;
