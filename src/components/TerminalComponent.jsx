import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const [npmInstalling, setNpmInstalling] = useState(false);
  const [installedPackages, setInstalledPackages] = useState([]);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);

  useEffect(() => {
    // Initialize xterm.js
    xtermRef.current = new Terminal({
      cursorBlink: true,
      fontFamily: "monospace",
      fontSize: 14,
      theme: {
        background: "#1e1e1e",
        foreground: "#f0f0f0",
        cursor: "#ffffff",
        selection: "#44475a",
      },
      convertEol: true,
    });

    fitAddonRef.current = new FitAddon();
    xtermRef.current.loadAddon(fitAddonRef.current);
    
    if (terminalRef.current) {
      xtermRef.current.open(terminalRef.current);
      fitAddonRef.current.fit();

      // Display welcome message
      xtermRef.current.writeln("\x1B[1;34m=== Web-based Code Editor Terminal ===\x1B[0m");
      xtermRef.current.writeln("Type 'help' to see available commands.");
      xtermRef.current.writeln("");
      promptUser();
    }

    // Handle resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!xtermRef.current) return;

    let currentInput = "";
    let commandHistory = [];
    let historyIndex = -1;

    const handleKeyEvent = (e) => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      if (ev.keyCode === 13) { // Enter key
        xtermRef.current.writeln("");
        if (currentInput.trim()) {
          processCommand(currentInput);
          commandHistory.push(currentInput);
          historyIndex = commandHistory.length;
        } else {
          promptUser();
        }
        currentInput = "";
      } else if (ev.keyCode === 8) { // Backspace
        if (currentInput.length > 0) {
          currentInput = currentInput.substring(0, currentInput.length - 1);
          xtermRef.current.write("\b \b");
        }
      } else if (ev.keyCode === 38) { // Up arrow key
        if (historyIndex > 0) {
          historyIndex--;
          // Clear current input display
          xtermRef.current.write("\r\x1B[K$ ");
          currentInput = commandHistory[historyIndex];
          xtermRef.current.write(currentInput);
        }
      } else if (ev.keyCode === 40) { // Down arrow key
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          // Clear current input display
          xtermRef.current.write("\r\x1B[K$ ");
          currentInput = commandHistory[historyIndex];
          xtermRef.current.write(currentInput);
        } else if (historyIndex === commandHistory.length - 1) {
          historyIndex = commandHistory.length;
          xtermRef.current.write("\r\x1B[K$ ");
          currentInput = "";
        }
      } else if (printable) {
        currentInput += e.key;
        xtermRef.current.write(e.key);
      }
    };

    xtermRef.current.onKey(handleKeyEvent);
  }, []);

  const promptUser = () => {
    if (xtermRef.current) {
      xtermRef.current.write("$ ");
    }
  };

  const processCommand = (command) => {
    const args = command.trim().split(" ");
    const cmd = args[0].toLowerCase();
    
    switch (cmd) {
      case "help":
        outputHelp();
        break;
      case "clear":
        xtermRef.current.clear();
        break;
      case "npm":
        processNpmCommand(args);
        break;
      case "ls":
        outputLs();
        break;
      case "pwd":
        xtermRef.current.writeln("/home/user/project");
        break;
      case "echo":
        xtermRef.current.writeln(args.slice(1).join(" "));
        break;
      case "installed-packages":
        outputInstalledPackages();
        break;
      default:
        xtermRef.current.writeln(`Command not found: ${cmd}`);
    }
    promptUser();
  };

  const outputHelp = () => {
    xtermRef.current.writeln("\x1B[1mAvailable commands:\x1B[0m");
    xtermRef.current.writeln("  help                 Show this help message");
    xtermRef.current.writeln("  clear                Clear the terminal");
    xtermRef.current.writeln("  npm install <pkg>    Install a package");
    xtermRef.current.writeln("  ls                   List files");
    xtermRef.current.writeln("  pwd                  Print working directory");
    xtermRef.current.writeln("  echo <message>       Display a message");
    xtermRef.current.writeln("  installed-packages   Show installed packages");
  };

  const outputLs = () => {
    xtermRef.current.writeln("index.js  package.json  node_modules/  src/  public/");
  };

  const outputInstalledPackages = () => {
    if (installedPackages.length === 0) {
      xtermRef.current.writeln("No packages installed yet.");
      return;
    }
    
    xtermRef.current.writeln("\x1B[1mInstalled packages:\x1B[0m");
    installedPackages.forEach((pkg) => {
      xtermRef.current.writeln(`  ${pkg.name}@${pkg.version}`);
    });
  };

  const processNpmCommand = (args) => {
    if (args.length < 2) {
      xtermRef.current.writeln("Usage: npm <command> [options]");
      return;
    }
    
    const npmCommand = args[1].toLowerCase();
    
    if (npmCommand === "install" && args.length >= 3) {
      const packageName = args[2];
      installPackage(packageName);
    } else {
      xtermRef.current.writeln(`Unsupported npm command: ${npmCommand}`);
    }
  };

  const installPackage = (packageName) => {
    setNpmInstalling(true);
    
    xtermRef.current.writeln(`\x1B[33mInstalling ${packageName}...\x1B[0m`);
    
    // Simulate package installation
    setTimeout(() => {
      // Generate random version
      const version = `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;
      
      xtermRef.current.writeln(`+ ${packageName}@${version}`);
      xtermRef.current.writeln(`\x1B[32mAdded ${packageName}@${version}\x1B[0m`);
      
      setInstalledPackages([...installedPackages, { name: packageName, version }]);
      setNpmInstalling(false);
      promptUser();
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>Terminal</span>
        <div style={styles.actions}>
          {npmInstalling && <div style={styles.loader}></div>}
        </div>
      </div>
      <div 
        ref={terminalRef} 
        style={styles.terminalContainer}
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "50%",
    backgroundColor: "#1e1e1e",
    color: "#f0f0f0",
    borderTop: "1px solid #333",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 10px",
    backgroundColor: "#333",
  },
  title: {
    fontWeight: "bold",
  },
  actions: {
    display: "flex",
    alignItems: "center",
  },
  terminalContainer: {
    flexGrow: 1,
    padding: "0px",
    overflowY: "auto",
  },
  loader: {
    width: "12px",
    height: "12px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid #ffffff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default TerminalComponent;