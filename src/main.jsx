import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UiProvider } from "./contexts/UiContext";
import { UserProvider } from "./contexts/UserContext";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true,

  onNeedRefresh() {
    updateSW(true);
  },

  onOfflineReady() {
    console.log("PWA pronta para uso offline.");
  },
});

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <UiProvider>
          <App />
        </UiProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);