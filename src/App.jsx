import React, { useState, useEffect } from "react";
import CodeEditor from "./components/CodeEditor";
import TerminalComponent from "./components/TerminalComponent";
import FileManager from "./components/FileManager";
import GeminiGuide from "./components/GeminiGuide";

function App() {
  const [code, setCode] = useState(""); 
  const [installedPackages, setInstalledPackages] = useState([]);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isTerminalFocused, setIsTerminalFocused] = useState(false);
  
  // Function to handle package installation
  const handlePackageInstall = (packageName, version) => {
    // Check if package is already installed
    if (!installedPackages.some(pkg => pkg.name === packageName)) {
      setInstalledPackages([...installedPackages, { name: packageName, version }]);
      // Show success message in console
      setConsoleOutput(prev => [...prev, {
        type: 'log',
        content: `Package ${packageName}@${version} installed successfully`
      }]);
    } else {
      // Show warning message in console
      setConsoleOutput(prev => [...prev, {
        type: 'warn',
        content: `Package ${packageName} is already installed`
      }]);
    }
  };
  
  // Function to handle code updates from Gemini
  const handleCodeUpdate = (updatedCode) => {
    setCode(updatedCode);
    // Show success message in console
    setConsoleOutput(prev => [...prev, {
      type: 'log',
      content: 'Code updated with AI suggestions'
    }]);
  };

  // Function to handle errors
  const handleError = (error) => {
    setConsoleOutput(prev => [...prev, {
      type: 'error',
      content: `Error: ${error.message || error}`
    }]);
  };
  
  // Initialize event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus terminal with Ctrl+`
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setIsTerminalFocused(true);
      }
      
      // Focus editor with Esc
      if (e.key === 'Escape' && isTerminalFocused) {
        setIsTerminalFocused(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTerminalFocused]);

  return (
    <div style={styles.container}>
      {/* Status bar */}
      <div style={styles.statusBar}>
        <div style={styles.statusSection}>
          <span style={styles.statusItem}>Line: 1</span>
          <span style={styles.statusItem}>Col: 1</span>
        </div>
        <div style={styles.statusSection}>
          {installedPackages.length > 0 && (
            <span style={styles.statusItem}>
              Packages: {installedPackages.length}
            </span>
          )}
          <span style={styles.statusItem}>React Editor</span>
        </div>
      </div>
      
      <div style={styles.mainContent}>
        {/* Left: File Manager */}
        <div style={styles.fileManager}>
          <FileManager installedPackages={installedPackages} />
        </div>

        {/* Center: Code Editor */}
        <div style={styles.editor}>
          <CodeEditor 
            setCode={setCode} 
            code={code} 
            onCodeChange={(newCode) => setCode(newCode)}
          />
        </div>

        {/* Right: AI Suggestions + Terminal */}
        <div style={styles.rightPanel}>
          <GeminiGuide 
            code={code} 
            onCodeUpdate={handleCodeUpdate} 
          />
          <TerminalComponent 
            focused={isTerminalFocused}
            onFocus={() => setIsTerminalFocused(true)}
            onBlur={() => setIsTerminalFocused(false)}
            onPackageInstall={handlePackageInstall}
            onError={handleError}
            consoleOutput={consoleOutput}
            setConsoleOutput={setConsoleOutput}
          />
        </div>
      </div>
      
      {/* Footer with helpful tips */}
      <div style={styles.footer}>
        <span style={styles.footerTip}>Tip: Press Ctrl+` to focus terminal</span>
        <span style={styles.footerTip}>Tip: Use Gemini AI for code suggestions</span>
      </div>
    </div>
  );
}

// Styles for the application
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#1e1e1e',
    color: '#f0f0f0',
    fontFamily: 'Consolas, monospace',
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 8px',
    backgroundColor: '#007acc',
    color: 'white',
    fontSize: '12px',
  },
  statusSection: {
    display: 'flex',
    gap: '16px',
  },
  statusItem: {
    padding: '0 4px',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  fileManager: {
    width: '200px',
    backgroundColor: '#252526',
    overflowY: 'auto',
    borderRight: '1px solid #3c3c3c',
  },
  editor: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  rightPanel: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#252526',
    borderLeft: '1px solid #3c3c3c',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '2px 8px',
    backgroundColor: '#007acc',
    color: 'white',
    fontSize: '11px',
  },
  footerTip: {
    opacity: 0.8,
  }
};

export default App;