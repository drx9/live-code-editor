import React, { useState, useEffect } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";

const CodeEditor = ({ setCode, code, onCodeChange }) => {
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [errors, setErrors] = useState([]);
  const [showConsole, setShowConsole] = useState(false);
  const [activeFile, setActiveFile] = useState("/App.js");
  

  const initialCode = code || `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1);
    console.log('Count increased to', count + 1);
  };
  
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>React Counter Example</h1>
      <p>You clicked {count} times</p>
      <button onClick={increment}>
        Click me
      </button>
    </div>
  );
}

export default App;`;

  // Files configuration
  const files = {
    "/App.js": {
      code: initialCode,
      active: activeFile === "/App.js",
    },
    "/index.js": {
      code: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);`,
      hidden: true,
    },
    "/styles.css": {
      code: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

button {
  padding: 8px 16px;
  background-color: #0078d7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #0069c0;
}`,
      hidden: true,
    },
  };


  // Handle code changes
  const handleCodeChange = (updatedFiles) => {
    if (updatedFiles[activeFile]) {
      const newCode = updatedFiles[activeFile].code;
      setCode(newCode);
      if (onCodeChange) {
        onCodeChange(newCode);
      }
    }
  };

  // Listen for console messages
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Override console methods to capture output
    console.log = (...args) => {
      setConsoleOutput(prev => [...prev, { type: 'log', content: args.join(' ') }]);
      originalConsoleLog(...args);
    };
    
    console.error = (...args) => {
      setConsoleOutput(prev => [...prev, { type: 'error', content: args.join(' ') }]);
      originalConsoleError(...args);
    };
    
    console.warn = (...args) => {
      setConsoleOutput(prev => [...prev, { type: 'warn', content: args.join(' ') }]);
      originalConsoleWarn(...args);
    };
    
    // Restore original console methods when component unmounts
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  // Clear console output
  const clearConsole = () => {
    setConsoleOutput([]);
    setErrors([]);
  };

  return (
    <div style={styles.editorContainer}>
      <div style={styles.editorHeader}>
        <div style={styles.tabs}>
          <button 
            style={{
              ...styles.tab,
              ...(activeFile === "/App.js" ? styles.activeTab : {})
            }}
            onClick={() => setActiveFile("/App.js")}
          >
            App.js
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeFile === "/styles.css" ? styles.activeTab : {})
            }}
            onClick={() => setActiveFile("/styles.css")}
          >
            styles.css
          </button>
        </div>
        <div style={styles.actions}>
          <button 
            style={styles.consoleToggle}
            onClick={() => setShowConsole(!showConsole)}
          >
            {showConsole ? "Hide Console" : "Show Console"}
            {errors.length > 0 && <span style={styles.errorBadge}>{errors.length}</span>}
          </button>
        </div>
      </div>
      
      <div style={styles.sandpackWrapper}>
        <Sandpack
          template="react"
          theme="dark"
          options={{
            showNavigator: false,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: showConsole ? "40vh" : "60vh",
            classes: {
              "sp-wrapper": "custom-wrapper",
              "sp-layout": "custom-layout",
              "sp-editor": "custom-editor",
            },
          }}
          files={files}
          customSetup={{
            dependencies: {
              "react": "^18.2.0",
              "react-dom": "^18.2.0"
            }
          }}
          onFileChange={handleCodeChange}
          autorun
        />
      </div>
      
      {showConsole && (
        <div style={styles.consoleContainer}>
          <div style={styles.consoleHeader}>
            <span style={styles.consoleTitle}>Console</span>
            <button 
              style={styles.clearButton}
              onClick={clearConsole}
            >
              Clear
            </button>
          </div>
          <div style={styles.consoleOutput}>
            {consoleOutput.length === 0 ? (
              <div style={styles.emptyConsole}>No console output yet.</div>
            ) : (
              consoleOutput.map((entry, index) => (
                <div 
                  key={index} 
                  style={{
                    ...styles.consoleEntry,
                    ...(entry.type === 'error' ? styles.errorEntry : {}),
                    ...(entry.type === 'warn' ? styles.warnEntry : {})
                  }}
                >
                  <span style={styles.consoleIcon}>
                    {entry.type === 'log' && '💬'}
                    {entry.type === 'error' && '❌'}
                    {entry.type === 'warn' && '⚠️'}
                  </span>
                  <span style={styles.consoleText}>{entry.content}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  editorContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#1e1e1e",
  },
  editorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 15px",
    backgroundColor: "#333",
    borderBottom: "1px solid #444",
  },
  tabs: {
    display: "flex",
    gap: "4px",
  },
  tab: {
    padding: "4px 12px",
    backgroundColor: "transparent",
    border: "none",
    color: "#ccc",
    borderRadius: "4px 4px 0 0",
    cursor: "pointer",
    fontSize: "13px",
  },
  activeTab: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  consoleToggle: {
    padding: "4px 10px",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    position: "relative",
  },
  errorBadge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "#f44336",
    color: "white",
    borderRadius: "50%",
    width: "15px",
    height: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "10px",
  },
  sandpackWrapper: {
    flex: showConsole => showConsole ? "0 0 60%" : "1",
    overflow: "hidden",
  },
  consoleContainer: {
    flex: "0 0 40%",
    backgroundColor: "#1e1e1e",
    borderTop: "1px solid #444",
    display: "flex",
    flexDirection: "column",
  },
  consoleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 15px",
    backgroundColor: "#333",
  },
  consoleTitle: {
    color: "#fff",
    fontSize: "13px",
  },
  clearButton: {
    padding: "2px 8px",
    backgroundColor: "transparent",
    border: "1px solid #666",
    color: "#ccc",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  consoleOutput: {
    padding: "10px",
    overflowY: "auto",
    flexGrow: 1,
  },
  consoleEntry: {
    padding: "4px 8px",
    marginBottom: "4px",
    borderLeft: "3px solid #555",
    backgroundColor: "#2d2d2d",
    color: "#eee",
    fontSize: "13px",
    fontFamily: "monospace",
    display: "flex",
    alignItems: "center",
  },
  errorEntry: {
    borderLeft: "3px solid #f44336",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  warnEntry: {
    borderLeft: "3px solid #ff9800",
    backgroundColor: "rgba(255, 152, 0, 0.1)",
  },
  consoleIcon: {
    marginRight: "8px",
    fontSize: "12px",
  },
  consoleText: {
    wordBreak: "break-word",
  },
  emptyConsole: {
    color: "#888",
    fontStyle: "italic",
    padding: "10px",
    textAlign: "center",
  },
};

export default CodeEditor;