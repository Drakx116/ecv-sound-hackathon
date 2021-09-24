import Play from "../Play/Play";
import styles from "./App.module.css";
import {music, MusicContext} from "../../contexts/music";
import Bubbles from "../Bubbles/Bubbles";
import {motion, AnimateSharedLayout, AnimatePresence} from "framer-motion";
import {useContext, useEffect, useRef, useState} from "react";
import {PlayIcon} from "@heroicons/react/solid";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Robot, {
    api,
    changeColor,
    changeColor2,
    fadeToAction,
} from "../Robot/Robot";
import {ChromePicker, ColorResult} from "react-color";
import {HexColorPicker} from "react-colorful";

function App() {
    const [selected, setSelected] = useState(artists[0]);
    const [source, setSource] = useState(null);
    const [context, setContext] = useState(null);
    const [play, setPlay] = useState(false);
    const [loading, setLoading] = useState(true);
    const [informations, setInformations] = useState({});
    const videoRef: HTMLVideoElement | any = useRef();
    const [colorCustom, setColorCustom] = useState("#fff");
    const [isInit, setIsInit] = useState(false);
    const [lGain, setLGain] = useState();
    const [mGain, setMGain] = useState();
    const [hGain, setHGain] = useState();
    const [isInitGains,setIsInitGains] = useState(false);
    const [mBand,setMBand] = useState(null);
    const [lBand,setLBand] = useState(null);
    const [hBand,setHBand] = useState(null);

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
                    setInformations({...informations, isPlaying: true});
                    setSelected(artists[3]);
                } else {
                    setInformations({...informations, isPlaying: true});
                    setSelected(artists[index - 1]);
                }
            }
        });
    };

    const nextSong = () => {
        artists.map((artist, index) => {
            if (artist.name === selected.name) {
                if (index === 3) {
                    setInformations({...informations, isPlaying: true});
                    setSelected(artists[0]);
                } else {
                    setInformations({...informations, isPlaying: true});
                    setSelected(artists[index + 1]);
                }
            }
        });
    };

    const jpp = (color: any) => {
        setColorCustom(color);
        setSelected({...selected, color: color});
        // console.log(selected);
    };

    const changeGain = (string: any, type: any) => {

        if (undefined === lGain || undefined === mGain || undefined === hGain) {
            return;
        }

        var value = parseFloat(string) / 255.0;

        // @ts-ignore
        switch (type) {
            case 'lowGain': // @ts-ignore
                lGain.gain.value = value;
                // @ts-ignore
                setLGain(lGain);
                break;
            case 'midGain': // @ts-ignore
                mGain.gain.value = value;
                setMGain(mGain);
                break;
            case 'highGain': // @ts-ignore
                hGain.gain.value = value;
                setHGain(hGain)
                break;
        }
    }


    const colorChange = (colorCustomEvent: any) => {
        if (
            //@ts-ignore
            typeof informations.audioRef !== "undefined" &&
            //@ts-ignore
            informations.audioRef !== null
        ) {
            const baseFrequency = 5000;
            const color = colorCustomEvent;

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
            if (source && context) {

                if (!isInit) {
                    setIsInit(true);

                    var gainDb = -40.0;
                    var bandSplit = [360, 3600];

                    // @ts-ignore
                    setHBand(context.createBiquadFilter());
                    if(hBand){
                        // @ts-ignore
                        hBand.type = "lowshelf";
                        // @ts-ignore
                        hBand.frequency.value = bandSplit[0];
                        // @ts-ignore
                        hBand.gain.value = gainDb;
                    }else{
                        setIsInit(false);
                    }


                    // @ts-ignore
                    var hInvert = context.createGain();
                    hInvert.gain.value = -1.0;

                    // @ts-ignore
                    setMBand(context.createGain());

                    // @ts-ignore
                    setLBand(context.createBiquadFilter());
                    if(lBand){
                        // @ts-ignore
                        lBand.type = "highshelf";
                        // @ts-ignore
                        lBand.frequency.value = bandSplit[1];
                        // @ts-ignore
                        lBand.gain.value = gainDb;
                    }else{
                        setIsInit(false);
                    }

                    // @ts-ignore
                    var lInvert = context.createGain();
                    lInvert.gain.value = -1.0;

                    if(lBand && mBand && hBand){
                        // @ts-ignore
                        source.connect(lBand);
                        // @ts-ignore
                        source.connect(mBand);
                        // @ts-ignore
                        source.connect(hBand);
                    }else{
                        setIsInit(false);
                    }

                    if(lBand && mBand && hBand){

                        // @ts-ignore
                        hBand.connect(hInvert);
                        // @ts-ignore
                        lBand.connect(lInvert);
                        // @ts-ignore
                        source.connect(lBand);
                        // @ts-ignore
                        source.connect(mBand);
                        // @ts-ignore
                        source.connect(hBand);

                        hInvert.connect(mBand);
                        lInvert.connect(mBand);
                    }else{
                        setIsInit(false);
                    }


                }

                // @ts-ignore
                setLGain(context.createGain());
                // @ts-ignore
                setMGain(context.createGain());
                // @ts-ignore
                setHGain(context.createGain());

                if(lGain && mGain && hGain && !isInitGains && lBand && mBand && hBand){
                    // @ts-ignore
                    lBand.connect(lGain);
                    // @ts-ignore
                    mBand.connect(mGain);
                    // @ts-ignore
                    hBand.connect(hGain);

                    // @ts-ignore
                    var sum = context.createGain();
                    // @ts-ignore
                    lGain.connect(sum);
                    // @ts-ignore
                    mGain.connect(sum);
                    // @ts-ignore
                    hGain.connect(sum);
                    // @ts-ignore
                    sum.connect(context.destination);

                    setIsInitGains(true);

                }


            }

            if (source !== null && context !== null) {
                // change

                const hexColors = color.replace("#", "").match(/.{1,2}/g);

                const colors: any = [];
                //@ts-ignore
                hexColors.forEach((color: any) => {
                    colors.push(parseInt(color, 16));
                });

                colors[2] = parseInt(color.substr(-2), 16);

                changeGain(colors[0], "lowGain");
                changeGain(colors[1], "midGain");
                changeGain(colors[2], "highGain");

            }
        }
    };

    useEffect(() => {
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
        <MusicContext.Provider value={{informations, setInformations}}>
            <div
                style={{
                    opacity: loading ? "0" : "1",
                    transition: "175ms ease-in-out",
                }}
            >
                <main
                    className={styles.main}
                    style={{backgroundColor: play ? "black" : "white"}}
                >
                    <AnimatePresence>
                        {play && (
                            <>
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 0.25}}
                                    exit={{opacity: 0}}
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
                                <div className="fixed left-48 top-48 z-50">
                                    <HexColorPicker
                                        color={colorCustom}
                                        onChange={colorChange}
                                        // onMouseUp={colorChange}
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
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                className="max-w-screen-lg mx-auto"
                            >
                                <div className="flex flex-col w-2/3">
                                    <h1 className="text-6xl font-bold">
                                        Discover the music that matches the colors you love.
                                    </h1>
                                    <p className="text-xl py-8">
                                        Because music is not only sounds, <br/> it can be
                                        represented in many different ways. <br/> We have chosen to
                                        present music to you through its colors.
                                    </p>
                                    <div>
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                            style={{backgroundColor: selected.color}}
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
                            className={`ease-in-out transition-all duration-200 absolute top-1/2 right-0 transform ${
                                !play ? "-translate-x-homecircle" : "-translate-x-24"
                            } -translate-y-1/2`}
                        >
                            {artists.map((artist) => (
                                <Item
                                    key={artist.name}
                                    artist={artist}
                                    play={play}
                                    isSelected={selected.name === artist.name}
                                    onClick={() => {
                                        setInformations({...informations, isPlaying: true});
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
                                animate={{opacity: 1}}
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
            </div>
            <div
                style={{
                    opacity: loading ? "0" : "1",
                    transition: "175ms ease-in-out",
                }}
            >
                <Robot load={{loading, setLoading}}/>
            </div>
            {loading && (
                <div className="css-selector fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                    <p className="text-gray-900">Loading...</p>
                </div>
            )}
        </MusicContext.Provider>
    );
}

function Item({artist, isSelected, onClick, play}: any) {
    return (
        <motion.li
            className={styles.item}
            onClick={onClick}
            style={{backgroundColor: artist.color, transform: play && "initial"}}
        >
            {isSelected && (
                <motion.div
                    layoutId="outline"
                    className={styles.outline}
                    initial={false}
                    animate={{borderColor: artist.color}}
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
