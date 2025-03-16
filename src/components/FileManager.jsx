import React, { useState } from "react";

const FileManager = () => {
  const [files, setFiles] = useState([
    { id: 1, name: "index.js", type: "file" },
    { id: 2, name: "package.json", type: "file" },
    { id: 3, name: "src", type: "folder", expanded: false, children: [
      { id: 4, name: "App.js", type: "file" },
      { id: 5, name: "index.js", type: "file" },
      { id: 6, name: "styles.css", type: "file" }
    ]},
    { id: 7, name: "public", type: "folder", expanded: false, children: [
      { id: 8, name: "index.html", type: "file" },
      { id: 9, name: "favicon.ico", type: "file" }
    ]},
    { id: 10, name: "README.md", type: "file" }
  ]);

  const [newFileName, setNewFileName] = useState("");
  const [isCreatingFile, setIsCreatingFile] = useState(false);

  const toggleFolder = (fileId) => {
    setFiles(files.map(file => {
      if (file.id === fileId) {
        return { ...file, expanded: !file.expanded };
      } else if (file.children) {
        return {
          ...file,
          children: file.children.map(child => 
            child.id === fileId ? { ...child, expanded: !child.expanded } : child
          )
        };
      }
      return file;
    }));
  };

  const addNewFile = () => {
    if (newFileName.trim()) {
      const type = newFileName.includes(".") ? "file" : "folder";
      const newFile = {
        id: Date.now(),
        name: newFileName,
        type,
        ...(type === "folder" && { expanded: false, children: [] })
      };
      
      setFiles([...files, newFile]);
      setNewFileName("");
      setIsCreatingFile(false);
    }
  };

  const renderFile = (file) => {
    const icon = file.type === "folder" 
      ? (file.expanded ? "📂" : "📁") 
      : getFileIcon(file.name);

    return (
      <div key={file.id}>
        <div 
          style={styles.file}
          onClick={() => file.type === "folder" && toggleFolder(file.id)}
        >
          <span style={styles.fileIcon}>{icon}</span>
          <span style={styles.fileName}>{file.name}</span>
        </div>
        
        {file.type === "folder" && file.expanded && (
          <div style={styles.children}>
            {file.children?.map(child => renderFile(child))}
          </div>
        )}
      </div>
    );
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    const fileIcons = {
      js: "📄",
      jsx: "📄",
      html: "📄",
      css: "📄",
      json: "📄",
      md: "📝",
      ico: "🖼️",
      default: "📄"
    };
    
    return fileIcons[extension] || fileIcons.default;
  };

  return (
    <div style={styles.fileManager}>
      <div style={styles.header}>
        <h3 style={styles.title}>📂 File Explorer</h3>
        <button 
          style={styles.newFileBtn} 
          onClick={() => setIsCreatingFile(true)}
        >
          +
        </button>
      </div>
      
      {isCreatingFile && (
        <div style={styles.newFileForm}>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="filename.js"
            style={styles.newFileInput}
            onKeyDown={(e) => e.key === "Enter" && addNewFile()}
            autoFocus
          />
          <div style={styles.newFileActions}>
            <button onClick={addNewFile} style={styles.actionBtn}>
              Create
            </button>
            <button 
              onClick={() => {
                setIsCreatingFile(false);
                setNewFileName("");
              }}
              style={{...styles.actionBtn, backgroundColor: "#555"}}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div style={styles.fileList}>
        {files.map(file => renderFile(file))}
      </div>
    </div>
  );
};

const styles = {
  fileManager: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: "0",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    borderBottom: "1px solid #333",
  },
  title: {
    margin: 0,
    fontSize: "16px",
  },
  newFileBtn: {
    backgroundColor: "#0078d7",
    color: "white",
    border: "none",
    borderRadius: "3px",
    width: "24px",
    height: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "16px",
  },
  fileList: {
    padding: "10px 0",
  },
  file: {
    display: "flex",
    alignItems: "center",
    padding: "4px 15px",
    cursor: "pointer",
    borderRadius: "3px",
    marginBottom: "2px",
  },
  fileIcon: {
    marginRight: "8px",
    fontSize: "16px",
  },
  fileName: {
    fontSize: "14px",
  },
  children: {
    paddingLeft: "12px",
  },
  newFileForm: {
    padding: "10px 15px",
    borderBottom: "1px solid #333",
  },
  newFileInput: {
    width: "100%",
    backgroundColor: "#2d2d2d",
    border: "1px solid #3e3e3e",
    color: "white",
    padding: "5px 8px",
    borderRadius: "3px",
    marginBottom: "8px",
    fontSize: "14px",
  },
  newFileActions: {
    display: "flex",
    gap: "8px",
  },
  actionBtn: {
    backgroundColor: "#0078d7",
    color: "white",
    border: "none",
    borderRadius: "3px",
    padding: "4px 8px",
    fontSize: "12px",
    cursor: "pointer",
  },
};

export default FileManager;