Live Code Editor with AI & NPM Support
🚀 A powerful web-based code editor built with React, featuring AI-powered code suggestions using Gemini, a built-in terminal, file management, and NPM package installation.

📌 Features
📄 File Management – Create, delete, and manage files within the editor.
💡 AI Code Suggestions – Uses Google Gemini AI to analyze and suggest improvements to your code.
📝 Code Editor – A Monaco-based editor with syntax highlighting, auto-completion, and linting.
🖥️ Terminal Emulator – Simulated terminal using xterm.js, supporting basic shell commands.
📦 NPM Package Manager – Install and manage NPM packages dynamically within the editor.
🌙 Theme Toggle – Switch between Dark Mode and Light Mode.
🛠️ Persistent State – Saves code and installed packages in local storage for session continuity.
⚙️ Tech Stack
Frontend: React + Vite
Editor: @codesandbox/sandpack-react
AI Integration: Google Gemini API
Terminal: xterm.js
Package Manager: Simulated NPM installation
Styling: Custom CSS with dynamic theme support

❌ Limitations / Pending Features
🔴 Actual Code Execution: The current setup does not support running code outside Sandpack’s environment.
🔴 Persistent Filesystem: Currently, file management does not persist beyond refresh (only code does).
🔴 Full NPM Support: While packages are installable, they are simulated and not actually available in the code runtime.
🔴 Better Error Handling: Some errors (e.g., AI API failures) need more detailed handling and UI feedback.

🛠️ Future Enhancements
✅ Enable actual package usage in the editor.
✅ Improve AI-generated suggestions with better context.
✅ Implement full filesystem persistence (e.g., IndexedDB or backend storage).
✅ Enhance terminal with more interactive shell commands.

***Live Link: https://vercel.com/drx9s-projects/live-code-editor/settings/domains***
