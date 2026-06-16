import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UiProvider } from "./contexts/UiContext";
import { UserProvider } from "./contexts/UserContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <BrowserRouter>
  <UserProvider>
    <UiProvider>
      <App />
    </UiProvider>
    </UserProvider>
  </BrowserRouter>
);