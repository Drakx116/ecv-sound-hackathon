import { useContext, useEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/solid";
import {
  ArrowCircleRightIcon,
  ArrowCircleLeftIcon,
} from "@heroicons/react/outline";
import { MusicContext } from "../../contexts/music";

// En attendant le useContext
const data = {
  author: "Leva Qotolashvili",
  title: "Giya Kancheli - Yellow Leaves",
  profilePicture:
    "https://image.freepik.com/photos-gratuite/portrait-homme-oktoberfest-portant-vetements-traditionnels-bavarois_155003-30001.jpg",
  song: "/assets/mp3/rezz-edge.mp3",
};

function AudioPlayer({ artist }: any) {
  const { informations, setInformations } = useContext(MusicContext);
  const [song, setSong] = useState(data);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0");
  const audioRef: HTMLAudioElement | any = useRef();
  const [duration, setDuration] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const convertSecondsToMinutesAndSeconds = (total: number) => {
    const minutes = Math.round(Math.floor(total / 60));
    const seconds = Math.round(total - minutes * 60);
    if (seconds < 10) {
      return `${minutes}:0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  };

  const play = () => {
    setInformations({
      ...informations,
      isPlaying: true,
      fromTimeUpdate: false,
    });
    setIsPlaying(true);
    audioRef.current.play();
  };

  const pause = () => {
    setIsPlaying(false);
    setInformations({
      ...informations,
      isPlaying: false,
      fromTimeUpdate: false,
    });
    audioRef.current.pause();
  };

  const onChange = (event: any) =>
    (audioRef.current.currentTime = event.target.value);

  useEffect(() => {
    if (typeof audioRef.current !== "undefined") {
      setInformations({
        ...informations,
        audioRef: audioRef,
        fromTimeUpdate: false,
      });
    }
    let root = document.documentElement;
    root.style.setProperty("--color-bar", artist.color);
    // @ts-ignore
    if (informations.isPlaying) {
      play();
    }
  }, [artist, audioRef]);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-70 bg-white px-8 py-4 w-full flex items-center border-t-4 border-gray-200">
        <input
          type="range"
          value={currentTime}
          step="0.01"
          className="absolute top-0 left-0 w-full p-0 m-0 transform -translate-y-3 bg-transparent"
          max={duration}
          onChange={onChange}
        />
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center w-full">
            <img
              src={`/artists/${artist.name}/pp.jpg`}
              className="h-12 w-12 border-rounded rounded-lg mr-4"
              alt=""
            />
            <div className="mr-16">
              <p className="text-base font-bold text-gray-900">{artist.title}</p>
              <p className="text-sm text-gray-600">{artist.author}</p>
            </div>
            <div>
              <div className="flex items-center">
                {typeof audioRef.current !== "undefined" && (
                  <>
                    <p className="text-xs text-gray-600">
                      {convertSecondsToMinutesAndSeconds(
                        Number(audioRef.current.currentTime)
                      )}{" "}
                      -
                    </p>
                    <p className=" text-xs text-gray-600">
                      &nbsp;
                      {convertSecondsToMinutesAndSeconds(Number(duration))}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            onClick={() => {
              console.log("music left");
            }}
          >
            <ArrowCircleLeftIcon className="h-8 w-8 text-gray-400" />
          </button>
          <button
            className="bg-yellow-300 rounded-full mx-4"
            style={{ backgroundColor: artist.color }}
          >
            {isPlaying ? (
              <PauseIcon
                className="h-12 w-12 text-white"
                onClick={() => pause()}
              />
            ) : (
              <PlayIcon
                className="h-12 w-12 text-white"
                onClick={() => play()}
              />
            )}
          </button>
          <button
            onClick={() => {
              console.log("music right");
            }}
          >
            <ArrowCircleRightIcon className="h-8 w-8 text-gray-400" />
          </button>
        </div>
        <div className="w-full flex justify-end">niveau sonore</div>
      </div>
      {/* balek */}
      <audio
        loop
        onLoadedData={(event: any) => setDuration(event.target.duration)}
        onTimeUpdate={(event: any) => {
          setInformations({
            ...informations,
            audioRef: audioRef,
            fromTimeUpdate: true,
          });
          setCurrentTime(event.target.currentTime);
        }}
        ref={audioRef}
        src={`/artists/${artist.name}/song.mp3`}
      ></audio>
      {/* end balek */}
    </>
  );
}

export default AudioPlayer;
