import React, { useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";

const CodeEditor = ({ setCode }) => {
  const handleCodeChange = (files) => {
    // Extract code from the App.js file and pass it to the parent
    if (files["/App.js"]) {
      setCode(files["/App.js"].code);
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <Sandpack
        template="react"
        theme="dark"
        options={{
          showLineNumbers: true,
          wrapContent: true,
          editorHeight: "100vh",
        }}
        files={{
          "/App.js": {
            code: "import React from 'react';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello, Sandpack!</h1>\n    </div>\n  );\n}\n\nexport default App;",
            readOnly: false,
          },
        }}
        customSetup={{
          dependencies: {
            "react": "^18.2.0",
            "react-dom": "^18.2.0"
          }
        }}
        onFileChange={handleCodeChange}
      />
    </div>
  );
};

export default CodeEditor;