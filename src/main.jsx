import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import rootReducer from "./reducer/index.js";
import { configureStore } from "@reduxjs/toolkit";
import AuthProvider from "./providers/AuthProvider.jsx";
import { TokenProvider } from "./context/TokenContext.jsx";
// import { setupAxiosInterceptors } from "./services/apiConnector.js";

const store = configureStore({
  reducer: rootReducer,
});

// setupAxiosInterceptors();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <TokenProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </TokenProvider>
    </Provider>
  </StrictMode>
);
