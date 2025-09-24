import App from "./App.tsx";

import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

const root = document.getElementById("root");

if (!root) throw new Error("Failed to find the root element");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<div>Login Page</div>} />
    </Routes>
  </BrowserRouter>,
);
