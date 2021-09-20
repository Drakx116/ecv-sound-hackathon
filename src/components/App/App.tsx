import Play from "../Play/Play";
import styles from "./App.module.css";
import { defaultMusic, MusicContext } from "../../contexts/music";
import Bubbles from "../Bubbles/Bubbles";
import ActionBar from '../ActionBar/ActionBar';

function App() {
  return (
    <MusicContext.Provider value={defaultMusic}>
      <main className={styles.main}>
        <Play />
        <Bubbles />
        <ActionBar />
      </main>
    </MusicContext.Provider>
  );
}

export default App;
