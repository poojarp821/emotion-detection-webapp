🧠 Real-Time Emotion-Based Theme Web App

A real-time face expression detection web app built with React, Vite, and face-api.js that dynamically adapts the UI theme based on detected user emotions.

---

Features

🎭 Real-Time Emotion Detection — Detects facial expressions via face-api.js models and adapts the app’s theme instantly.

📷 Camera Integration — Uses WebRTC (MediaDevices API) to access live camera feed.

⚡ Optimized Performance — Achieves sub-200ms detection latency through model optimization, requestAnimationFrame, and throttling.

🎨 Dynamic Theme Management — Stores preferences in localStorage and supports both expression-based and manual theme switching.

🧩 Scalable Architecture — Built using useReducer, Context API, and custom hooks for state and theme management.

🧱 Custom Dashboard — Includes a live theme customization dashboard for personalized user experiences.

💡 Enhanced UX — Smooth animations, alerts, and banners communicate detected emotions in real time.

⚙️ Optimized React Setup — Uses React Suspense, lazy loading, and canvas-based overlays for performance and clarity