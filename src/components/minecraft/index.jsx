import { useState } from "react";
import "./styles.css";
import App from "./App";

export default function Minecraft() {
  const [ready, set] = useState(true);
  return (
    <>
      <App />
      <div className="absolute top-5 left-5">
        <p class="text-base rounded bg-slate-700 p-2 opacity-80">Click to take mouse control. Press escape to take back control.</p>
      </div>

      <div className="absolute top-5 right-5">
        <a href="/" class="text-white drop-shadow-lg">Go Home</a>
      </div>
      <div className="dot" />
      <div className={`fullscreen bg ${ready ? "ready" : "notready"} ${ready && "clicked"}`}>
      </div>
    </>
  );
}