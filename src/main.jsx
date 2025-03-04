import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { basePath } from "./context/constants";
import ErrorBoundary from "./utils/ErrorBoundary";
createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter basename={basePath}>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
);
