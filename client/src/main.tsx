import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Import i18n
import "./i18n";

createRoot(document.getElementById("root")!).render(<App />);
