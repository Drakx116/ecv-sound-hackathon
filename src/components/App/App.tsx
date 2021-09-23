import Play from "../Play/Play";
import styles from "./App.module.css";
import { defaultMusic, MusicContext } from "../../contexts/music";
import Bubbles from "../Bubbles/Bubbles";
import ActionBar from "../ActionBar/ActionBar";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { useState } from "react";

function App() {
  return (
    <div className="h-screen bg-white w-full">
      <AudioPlayer />
    </div>
  );
}

export default App;
