import { useState } from "react";
import "./styles.css";
import App from "./App";

export default function Minecraft() {
  const [ready, set] = useState(true);
  return (
    <>
      <App />
      <div className="dot" />
      <div className={`fullscreen bg ${ready ? "ready" : "notready"} ${ready && "clicked"}`}>
      </div>
    </>
  );
}