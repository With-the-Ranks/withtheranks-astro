import { useState } from "react";
import "./styles.css";
import App from "./App";

export default function Minecraft() {
  const [ready, set] = useState(false);
  return (
    <>
      <App />
      <div className="dot" />
      <div className={`fullscreen bg ${ready ? "ready" : "notready"} ${ready && "clicked"}`}>
        <div className="stack">
          <button onClick={() => set(true)}>Start</button>
        </div>
      </div>
    </>
  );
}