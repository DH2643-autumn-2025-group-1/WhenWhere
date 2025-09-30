import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Root } from "./views/Root.tsx";
import { createGlobalStyle } from "styled-components";

const root = document.getElementById("root");
if (!root) throw new Error("Failed to find the root element");

const GlobalStyle = createGlobalStyle<{ appBarHeight?: number }>`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 100%;
  }
`;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <GlobalStyle />
    <Root />
  </BrowserRouter>,
);
