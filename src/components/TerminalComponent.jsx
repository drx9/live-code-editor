import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false); 

  useEffect(() => {
    if (!terminalRef.current || isMounted) return;

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
    xtermRef.current.open(terminalRef.current);

    
    setTimeout(() => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
        setIsMounted(true); 
      }
    }, 100);

    xtermRef.current.writeln("\x1B[1;34m=== Web-based Code Editor Terminal ===\x1B[0m");
    xtermRef.current.writeln("Type 'help' to see available commands.\n");
    promptUser();

    const handleResize = () => {
      if (isMounted && fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (xtermRef.current) xtermRef.current.dispose();
    };
  }, [isMounted]);

  const promptUser = () => {
    if (xtermRef.current) {
      xtermRef.current.write("$ ");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>Terminal</span>
      </div>
      <div ref={terminalRef} style={styles.terminalContainer} />
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
  terminalContainer: {
    flexGrow: 1,
    padding: "0px",
    overflowY: "auto",
  },
};

export default TerminalComponent;
