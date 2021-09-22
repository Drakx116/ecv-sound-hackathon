import Play from "../Play/Play";
import styles from "./App.module.css";
import { defaultMusic, MusicContext } from "../../contexts/music";
import Bubbles from "../Bubbles/Bubbles";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PlayIcon } from "@heroicons/react/solid";

function App() {
  const [selected, setSelected] = useState(artists[0]);
  const [play, setPlay] = useState(false);
  return (
    <MusicContext.Provider value={defaultMusic}>
      <main
        className={styles.main}
        style={{ backgroundColor: play ? "black" : "white" }}
      >
        <AnimatePresence>
          {play && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="h-screen w-full absolute top-0 left-0 right-0 bottom-0 z-0 flex justify-center items-center overflow-hidden"
            >
              <video
                autoPlay
                className="w-full h-auto"
                loop
                muted
                src={`/artists/${selected.name}/clip.webm`}
              ></video>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!play && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-screen-lg mx-auto"
            >
              <div className="flex flex-col w-2/3">
                <h1 className="text-6xl font-bold">
                  Discover the music that matches the colors you love.
                </h1>
                <p className="text-xl py-8">
                  Because music is not only sounds, <br /> it can be represented
                  in many different ways. <br /> We have chosen to present music
                  to you through its colors.
                </p>
                <div>
                  <button
                    type="button"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: selected.color }}
                    onClick={() => setPlay(true)}
                  >
                    <PlayIcon
                      className="-ml-1 mr-3 h-5 w-5"
                      aria-hidden="true"
                    />
                    Play music
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimateSharedLayout>
          <ul
            className={`ease-in-out transition-all duration-200 absolute top-1/2 right-0 transform ${
              !play ? "-translate-x-homecircle" : "-translate-x-24"
            } -translate-y-1/2`}
          >
            {artists.map((artist) => (
              <Item
                key={artist.name}
                artist={artist}
                play={play}
                isSelected={selected.color === artist.color}
                onClick={() => setSelected(artist)}
              />
            ))}
          </ul>
        </AnimateSharedLayout>
        <AnimatePresence>
          {!play && (
            <motion.div
              initial={{
                opacity: 0,
                transform: "translateX(25%) translateY(-50%)",
              }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                transform: "translateX(100%) translateY(-50%)",
              }}
              exit={{
                opacity: 0,
                transform: "translateX(100%) translateY(-50%)",
              }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4 w-homecircle h-homecircle rounded-full overflow-hidden bg-dusky"
              style={{
                backgroundColor: selected.color,
                borderColor: selected.color,
                borderWidth: "1rem",
              }}
            >
              <video
                loop
                autoPlay
                muted
                className="w-homecircle h-homecircle relative overflow-hidden rounded-full transform scale-200"
                src={`/artists/${selected.name}/preview.mp4`}
              ></video>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MusicContext.Provider>
  );
}

function Item({ artist, isSelected, onClick, play }: any) {
  return (
    <motion.li
      className={styles.item}
      onClick={onClick}
      style={{ backgroundColor: artist.color, transform: play && "initial" }}
    >
      {isSelected && (
        <motion.div
          layoutId="outline"
          className={styles.outline}
          initial={false}
          animate={{ borderColor: artist.color }}
          transition={spring}
        >
          <img
            className="rounded-full"
            src={`/artists/${artist.name}/pp.jpg`}
            alt=""
          />
        </motion.div>
      )}
    </motion.li>
  );
}

const artists = [
  { name: "drake", color: "#ff0055" },
  { name: "gambi", color: "#0099ff" },
  { name: "postmalone", color: "#22cc88" },
  { name: "travisscott", color: "#ffaa00" },
];

const spring = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

export default App;
