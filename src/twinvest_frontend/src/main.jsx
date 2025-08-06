import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import ReactDOM from "react-dom/client";
import "./index.css";
import Apps from "./Apps.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Apps />
    </Router>
  </React.StrictMode>
);
