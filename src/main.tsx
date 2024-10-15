import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// This is the entry point of the application, it renders the App component into the root element in the HTML DOM
// The only thing that we need to change here is importing the bootstrap css file
import "bootstrap/dist/css/bootstrap.css";
// We need to import it before the App.css file, so that the changes made in the App.css file can override the bootstrap css file
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
