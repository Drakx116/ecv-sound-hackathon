import { useEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/solid";
import {
  ArrowCircleRightIcon,
  ArrowCircleLeftIcon,
} from "@heroicons/react/outline";

// En attendant le useContext
const data = {
  author: "Leva Qotolashvili",
  title: "Giya Kancheli - Yellow Leaves",
  profilePicture:
    "https://image.freepik.com/photos-gratuite/portrait-homme-oktoberfest-portant-vetements-traditionnels-bavarois_155003-30001.jpg",
  song: "/assets/mp3/rezz-edge.mp3",
};

function AudioPlayer() {
  const [song, setSong] = useState(data);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0");
  const audioRef: HTMLAudioElement | any = useRef();
  const [duration, setDuration] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const play = () => {
    setIsPlaying(true);
    audioRef.current.play();
  };

  const pause = () => {
    setIsPlaying(false);
    audioRef.current.pause();
  };

  const onChange = (event: any) =>
    (audioRef.current.currentTime = event.target.value);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-70 bg-white px-8 py-4 w-full flex items-center border-t-4 border-gray-200">
        <input
          type="range"
          value={currentTime}
          step="0.01"
          className="absolute top-0 left-0 w-full p-0 m-0 transform -translate-y-3"
          max={duration}
          onChange={onChange}
        />
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center w-full">
            <img
              src={song.profilePicture}
              className="h-12 w-12 border-rounded rounded-lg mr-4"
              alt=""
            />
            <div className="mr-16">
              <p className="text-base font-bold text-gray-900">{data.title}</p>
              <p className="text-sm text-gray-600">{data.author}</p>
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
          <button className="bg-yellow-300 rounded-full mx-4">
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
        onPlay={() => {
          console.log("on play");
        }}
        onLoadedData={(event: any) => setDuration(event.target.duration)}
        onTimeUpdate={(event: any) => setCurrentTime(event.target.currentTime)}
        ref={audioRef}
        src="/assets/mp3/rezz-edge.mp3"
      ></audio>
      {/* end balek */}
    </>
  );
}

export default AudioPlayer;

{
  /* <div className="flex items-center">
            {typeof audioRef.current !== "undefined" && (
              <>
                <p className="mr-4 text-xs text-gray-600">
                  {Math.round(audioRef.current.currentTime)}
                </p>
                <p className=" text-xs text-gray-600">{`${Math.round(
                  Math.floor(duration / 60)
                )}:${Math.round(
                  duration - Math.floor(duration / 60) * 60
                )}`}</p>
              </>
            )}
          </div> */
}
