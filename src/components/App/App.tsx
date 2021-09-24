import Play from "../Play/Play";
import styles from "./App.module.css";
import { music, MusicContext } from "../../contexts/music";
import Bubbles from "../Bubbles/Bubbles";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { PlayIcon } from "@heroicons/react/solid";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Robot, {
  api,
  changeColor,
  changeColor2,
  fadeToAction,
} from "../Robot/Robot";
import { ChromePicker, ColorResult } from "react-color";
import { HexColorPicker } from "react-colorful";

function App() {
  const [selected, setSelected] = useState(artists[0]);
  const [source, setSource] = useState(null);
  const [context, setContext] = useState(null);
  const [play, setPlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [informations, setInformations] = useState({});
  const videoRef: HTMLVideoElement | any = useRef();
  const [colorCustom, setColorCustom] = useState("#fff");
  const goHome = () => {
    fadeToAction("TurnBack", 1.5);
    setInformations({
      ...selected,
      isPlaying: false,
      fromTimeUpdate: false,
    });
    setPlay(false);
  };

  const previousSong = () => {
    artists.map((artist, index) => {
      if (artist.name === selected.name) {
        if (index === 0) {
          setInformations({ ...informations, isPlaying: true });
          setSelected(artists[3]);
        } else {
          setInformations({ ...informations, isPlaying: true });
          setSelected(artists[index - 1]);
        }
      }
    });
  };

  const nextSong = () => {
    artists.map((artist, index) => {
      if (artist.name === selected.name) {
        if (index === 3) {
          setInformations({ ...informations, isPlaying: true });
          setSelected(artists[0]);
        } else {
          setInformations({ ...informations, isPlaying: true });
          setSelected(artists[index + 1]);
        }
      }
    });
  };

  const jpp = (color: any) => {
    setColorCustom(color);
    setSelected({ ...selected, color: color });
    // console.log(selected);
  };

  const colorChange = (colorCustomEvent: any) => {
    if (
      //@ts-ignore
      typeof informations.audioRef !== "undefined" &&
      //@ts-ignore
      informations.audioRef !== null
    ) {
      const baseFrequency = 5000;
      const color = colorCustom;

      // AUDIO CONTEXT - LOW PASS FILTER
      if (context === null) {
        //@ts-ignore
        setContext(new (window.AudioContext || window.webkitAudioContext)());
      }
      //@ts-ignore
      const mediaElement = informations.audioRef.current;
      if (source === null && context !== null) {
        //@ts-ignore
        setSource(context.createMediaElementSource(mediaElement));
      }
      if (source !== null && context !== null) {
        //@ts-ignore
        const lowPass = context.createBiquadFilter();

        // source.connect(highPass);
        //@ts-ignore
        source.connect(lowPass);
        //@ts-ignore
        lowPass.connect(context.destination);

        lowPass.type = "lowpass";
        lowPass.frequency.value = baseFrequency;
        lowPass.Q.value = 0.7;

        // change

        const hexColors = color.replace("#", "").match(/.{1,2}/g);

        const colors: any = [];
        //@ts-ignore
        hexColors.forEach((color: any) => {
          colors.push(parseInt(color, 16));
        });

        // * GESTION DU VOLUME
        mediaElement.volume = (colors[0] + colors[1] + colors[2]) / 765;

        // 0 < brightness < 255
        const brightness =
          0.299 * colors[0] + 0.587 * colors[1] + 0.114 * colors[2];

        lowPass.frequency.value = (5000 * brightness) / 255;
      }
    }
  };

  useEffect(() => {
    document.title = "x-bot-player";
    // animation with song
    //@ts-ignore
    if (
      typeof videoRef.current !== "undefined" &&
      videoRef.current !== null &&
      //@ts-ignore
      informations.isPlaying
    ) {
      if (
        videoRef.current.currentTime >= 2 &&
        videoRef.current.currentTime <= 29
      ) {
        fadeToAction("Armature|Swing", 1.5);
        api.speed = 0.75;
      }

      if (
        videoRef.current.currentTime > 29 &&
        videoRef.current.currentTime <= 48
      ) {
        fadeToAction("Armature|Belly", 1.5);
      }
      if (
        videoRef.current.currentTime > 48 &&
        videoRef.current.currentTime <= 54
      ) {
        fadeToAction("Armature|Brooklyn", 1.5);
        api.speed = 1;
      }
      if (
        videoRef.current.currentTime > 54 &&
        videoRef.current.currentTime <= 59
      ) {
        fadeToAction("Armature|Maraschino", 1.5);
        api.speed = 1;
      }
      if (
        videoRef.current.currentTime > 59 &&
        videoRef.current.currentTime <= 85
      ) {
        fadeToAction("Armature|RunningMan", 1.5);
        api.speed = 1;
      }
      if (
        videoRef.current.currentTime > 85 &&
        videoRef.current.currentTime <= 97
      ) {
        fadeToAction("Armature|Rumba", 1.5);
        api.speed = 1.25;
      }
      if (
        videoRef.current.currentTime > 97 &&
        videoRef.current.currentTime <= 100
      ) {
        fadeToAction("Armature|Wave", 1.5);
        api.speed = 0.75;
      }
      if (
        videoRef.current.currentTime > 100 &&
        videoRef.current.currentTime <= 125
      ) {
        fadeToAction("Armature|Swing", 1.5);
        api.speed = 1.25;
      }
      if (
        videoRef.current.currentTime > 125 &&
        videoRef.current.currentTime <= 140
      ) {
        fadeToAction("Armature|Belly", 1.5);
        api.speed = 1;
      }
      if (
        videoRef.current.currentTime > 140 &&
        videoRef.current.currentTime <= 170
      ) {
        fadeToAction("Armature|RunningMan", 1.5);
        api.speed = 1;
      }
      if (
        videoRef.current.currentTime > 170 &&
        videoRef.current.currentTime <= 200
      ) {
        fadeToAction("Armature|Brooklyn", 1.5);
        api.speed = 1;
      }
      if (
        videoRef.current.currentTime > 200 &&
        videoRef.current.currentTime <= 220
      ) {
        fadeToAction("Armature|Swing", 1.5);
        api.speed = 1;
      }
      if (
        videoRef.current.currentTime > 220 &&
        videoRef.current.currentTime <= 250
      ) {
        fadeToAction("Armature|Rumba", 1.5);
        api.speed = 0.75;
      }
      if (
        videoRef.current.currentTime > 250 &&
        videoRef.current.currentTime <= 270
      ) {
        fadeToAction("Armature|Wave", 1.5);
        api.speed = 1;
      }
      if (
        videoRef.current.currentTime > 270 &&
        videoRef.current.currentTime <= 300
      ) {
        fadeToAction("Armature|BreakDance", 1.5);
        api.speed = 1;
      }
      if (
        videoRef.current.currentTime > 300 &&
        videoRef.current.currentTime <= 320
      ) {
        fadeToAction("Armature|Stop", 1.5);
        api.speed = 1;
      }
    }

    if (typeof videoRef.current !== "undefined" && videoRef.current !== null) {
      //@ts-ignore
      if (!informations.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }

    if (!loading) {
      const color2 = selected.color.replace("#", "0x");
      const color = selected.color2.replace("#", "0x");
      changeColor(color);
      changeColor2(color2);
    }

    //@ts-ignore
    if (
      typeof videoRef.current !== "undefined" &&
      //@ts-ignore
      typeof informations.audioRef !== "undefined" &&
      //@ts-ignore
      typeof informations.fromTimeUpdate !== "undefined" &&
      //@ts-ignore
      informations.fromTimeUpdate &&
      //@ts-ignore
      informations.audioRef.current !== null
    ) {
      videoRef.current.currentTime =
        //@ts-ignore
        informations.audioRef.current.currentTime;
    }
  }, [informations]);

  return (
    <MusicContext.Provider value={{ informations, setInformations }}>
      <div
        style={{
          opacity: loading ? "0" : "1",
          transition: "175ms ease-in-out",
        }}
      >
        <main
          className={styles.main}
          style={{ backgroundColor: play ? "black" : "white" }}
        >
          <AnimatePresence>
            {play && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.25 }}
                  exit={{ opacity: 0 }}
                  className="h-screen w-full absolute top-0 left-0 right-0 bottom-0 z-0 flex justify-center items-center overflow-hidden"
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-auto"
                    loop
                    muted
                    src={`/artists/${selected.name}/opti.mp4`}
                  ></video>
                </motion.div>
                <div className="fixed left-48 top-48 z-50 hidden md:block">
                  <HexColorPicker
                    color={colorCustom}
                    onChange={jpp}
                    onMouseUp={colorChange}
                  />
                </div>
                <AudioPlayer
                  nextSong={nextSong}
                  previousSong={previousSong}
                  goHome={goHome}
                  artist={selected}
                />
              </>
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
                <div className="flex flex-col md:w-2/3">
                  <h1 className="text-6xl font-bold">
                    Discover the music that matches the colors you love.
                  </h1>
                  <p className="text-xl py-8">
                    Because music is not only sounds, <br /> it can be
                    represented in many different ways. <br /> We have chosen to
                    present music to you through its colors.
                  </p>
                  <div>
                    <button
                      type="button"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ backgroundColor: selected.color }}
                      onClick={() => {
                        fadeToAction("Armature|Run", 1.5);
                        setInformations({
                          ...selected,
                          isPlaying: true,
                          fromTimeUpdate: false,
                        });
                        setPlay(true);
                      }}
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
              className={`ease-in-out transition-all mt-12 md:mt-0 justify-center duration-200 md:absolute top-1/2 z-50 xl:right-0 right-12 transform flex flex-wrap items-center md:block ${
                !play ? "xl:-translate-x-homecircle" : "xl:-translate-x-24"
              } md:-translate-y-1/2`}
            >
              {artists.map((artist) => (
                <Item
                  key={artist.name}
                  artist={artist}
                  play={play}
                  isSelected={selected.name === artist.name}
                  onClick={() => {
                    setInformations({ ...informations, isPlaying: true });
                    setSelected(artist);
                  }}
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
                className="z-50 absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4 w-homecircle h-homecircle rounded-full overflow-hidden bg-dusky hidden xl:block"
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
      </div>
      <div
        style={{
          opacity: loading ? "0" : "1",
          transition: "175ms ease-in-out",
        }}
      >
        <Robot load={{ loading, setLoading }} />
      </div>
      {loading && (
        <div className="css-selector fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center">
          <p className="text-gray-900">Loading...</p>
        </div>
      )}
    </MusicContext.Provider>
  );
}

function Item({ artist, isSelected, onClick, play }: any) {
  return (
    <motion.li
      className={`${styles.item} ${play && "opacity-0 md:opacity-100"}`}
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
  {
    name: "drake",
    author: "Drake",
    title: "Hotline Bling",
    color: "#ff0055",
    color2: "#7F1D1D",
    mp3: "/assets/mp3/drake.mp3",
  },
  {
    name: "gambi",
    author: "Gambi",
    title: "Macintosh",
    color: "#0099ff",
    color2: "#1E3A8A",
    mp3: "/assets/mp3/gambi.mp3",
  },
  {
    name: "postmalone",
    author: "Post Malone",
    title: "Rockstar ft. 21 Savage",
    color: "#22cc88",
    color2: "#064E3B",
    mp3: "/assets/mp3/malone.mp3",
  },
  {
    name: "travisscott",
    author: "Travis Scott",
    title: "Sicko Mode",
    color: "#ffaa00",
    color2: "#78350F",
    mp3: "/assets/mp3/travis.mp3",
  },
];

const spring = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

export default App;
