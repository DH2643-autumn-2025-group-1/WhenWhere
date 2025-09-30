import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Root } from "./views/Root.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("Failed to find the root element");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>,
);
