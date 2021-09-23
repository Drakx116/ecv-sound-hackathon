import { useEffect, useRef, useState } from "react";

function AudioPlayer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-70 bg-white px-8 py-4 w-full"></div>
  );
}

function ActionBar() {
  const [percentage, setPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef();

  const onChange = (e: any) => {
    const audio: any = audioRef.current;
    audio.currentTime = (audio.duration / 100) * e.target.value;
    setPercentage(e.target.value);
  };

  const play = () => {
    const audio: any = audioRef.current;
    audio.volume = 0.1;

    if (!isPlaying) {
      setIsPlaying(true);
      audio.play();
    }

    if (isPlaying) {
      setIsPlaying(false);
      audio.pause();
    }
  };

  const getCurrDuration = (e: any) => {
    const percent = (
      (e.currentTarget.currentTime / e.currentTarget.duration) *
      100
    ).toFixed(2);
    const time = e.currentTarget.currentTime;

    setPercentage(+percent);
    setCurrentTime(time.toFixed(2));
  };

  return (
    <div className="app-container">
      <h1>Audio Player</h1>
      <Slider percentage={percentage} onChange={onChange} />
      <audio
        //@ts-ignore
        ref={audioRef}
        onTimeUpdate={getCurrDuration}
        onLoadedData={(e) => {
          //@ts-ignore
          setDuration(e.currentTarget.duration.toFixed(2));
        }}
        src="/assets/mp3/rezz-edge.mp3"
      ></audio>
      <ControlPanel
        play={play}
        isPlaying={isPlaying}
        duration={duration}
        currentTime={currentTime}
      />
    </div>
  );
}

function Slider({ percentage = 0, onChange }: any) {
  const [position, setPosition] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const rangeRef = useRef();
  const thumbRef = useRef();

  useEffect(() => {
    //@ts-ignore
    const rangeWidth = rangeRef.current.getBoundingClientRect().width;
    //@ts-ignore
    const thumbWidth = thumbRef.current.getBoundingClientRect().width;
    const centerThumb = (thumbWidth / 100) * percentage * -1;
    const centerProgressBar =
      thumbWidth +
      (rangeWidth / 100) * percentage -
      (thumbWidth / 100) * percentage;
    setPosition(percentage);
    setMarginLeft(centerThumb);
    setProgressBarWidth(centerProgressBar);
  }, [percentage]);

  return (
    <div className="slider-container">
      <div
        className="progress-bar-cover"
        style={{
          width: `${progressBarWidth}px`,
        }}
      ></div>
      <div
        className="thumb"
        //@ts-ignore
        ref={thumbRef}
        style={{
          left: `${position}%`,
          marginLeft: `${marginLeft}px`,
        }}
      ></div>
      <input
        type="range"
        value={position}
        //@ts-ignore
        ref={rangeRef}
        step="0.01"
        className="range"
        onChange={onChange}
      />
    </div>
  );
}

function ControlPanel({ play, isPlaying, duration, currentTime }: any) {
  function secondsToHms(seconds: any) {
    if (!seconds) return "00m 00s";

    let duration = seconds;
    let hours = duration / 3600;
    duration = duration % 3600;
    //@ts-ignore
    let min: any = parseInt(duration / 60);
    duration = duration % 60;

    let sec: any = parseInt(duration);

    if (sec < 10) {
      sec = `0${sec}`;
    }
    if (min < 10) {
      min = `0${min}`;
    }
    //@ts-ignore
    if (parseInt(hours, 10) > 0) {
      //@ts-ignore
      return `${parseInt(hours, 10)}h ${min}m ${sec}s`;
    } else if (min == 0) {
      return `00m ${sec}s`;
    } else {
      return `${min}m ${sec}s`;
    }
  }

  return (
    <div className="control-panel">
      <div className="timer">{secondsToHms(currentTime)}</div>
      <div className="timer">{secondsToHms(duration)}</div>
    </div>
  );
}

export default AudioPlayer;
