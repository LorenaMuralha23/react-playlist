import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import './index.css'
import React from 'react';
import AppRoutes from "./routes/AppRoutes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </React.StrictMode>
);