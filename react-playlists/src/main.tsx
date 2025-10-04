import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import './index.css'
import App from './App.tsx'
import React from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
