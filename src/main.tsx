import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { Provider } from "react-redux";

import { store } from "@/store";
import GlobalContextProvider from "@/context/globalContext";
import ThemeProvider from "@/context/themeContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider>
          <GlobalContextProvider>
            <LazyMotion features={domAnimation}>
              <App />
            </LazyMotion>
          </GlobalContextProvider>
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
