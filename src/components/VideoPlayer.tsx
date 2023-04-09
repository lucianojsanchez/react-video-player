import React from "react";
import { useState, useRef } from "react";
import {
  FiPlayCircle,
  FiStopCircle,
  FiVolume2,
  FiVolumeX,
  FiMinimize,
  FiMaximize,
} from "react-icons/fi";
import source from "../assets/src.mp4";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);

  const videoPlayer = useRef<HTMLVideoElement>(null);

  const handleOnLoadedMetadata = () => {
    const seconds = Math.floor(videoPlayer.current?.duration ?? 0);
    setDuration(seconds);
  };

  const handleVolumeChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    setVolume(value);
    if (videoPlayer.current) {
      videoPlayer.current.volume = value;
      setIsMuted(value === 0);
    }
  };

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlay = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      videoPlayer.current?.play();
    } else {
      videoPlayer.current?.pause();
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoPlayer.current?.currentTime ?? 0);
  };

  const handleProgressClick = (
    event: React.MouseEvent<HTMLProgressElement>
  ) => {
    if (videoPlayer.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const percentage = x / rect.width;
      videoPlayer.current.currentTime =
        percentage * videoPlayer.current.duration;
    }
  };

  const handleMute = () => {
    const newIsMuted = !isMuted;
    setIsMuted(newIsMuted);
    if (videoPlayer.current) {
      videoPlayer.current.muted = newIsMuted;
      if (newIsMuted) {
        setVolume(0);
      } else {
        setVolume(0.5);
      }
    }
  };

  const handleFullScreen = () => {
    if (!isFullScreen) {
      setIsFullScreen(true);
      if (videoPlayer.current?.requestFullscreen) {
        videoPlayer.current.requestFullscreen();
      }
    } else {
      setIsFullScreen(false);
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto">
      <video
        onClick={togglePlay}
        ref={videoPlayer}
        src={source}
        onLoadedMetadata={handleOnLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        className="w-full  mx-auto shadow-lg rounded-lg"
      />
      <div className="flex flex-col items-center w-full bg-gray-800 bg-opacity-50 py-2 justify-between px-4 rounded-lg">
        <div className="flex items-center">
          <button className="text-white" onClick={togglePlay}>
            {isPlaying ? (
              <FiStopCircle className="text-4xl" />
            ) : (
              <FiPlayCircle className="text-4xl" />
            )}
          </button>
          <button className="text-white ml-4" onClick={handleMute}>
            {isMuted ? (
              <FiVolumeX className="text-3xl" />
            ) : (
              <FiVolume2 className="text-3xl" />
            )}
          </button>
          <input
            className="ml-4 w-24"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
          />
          <button onClick={handleFullScreen}>
            {isFullScreen ? <FiMinimize /> : <FiMaximize />}
          </button>
        </div>
        <div className="relative w-full mt-2">
          <span className="absolute left-0 ">{calculateTime(currentTime)}</span>
          <span className="absolute right-0 ">{calculateTime(duration)}</span>
          <progress
            className="w-full h-2 mt-6 rounded-lg bg-gray-300 cursor-pointer "
            max={videoPlayer.current?.duration}
            value={videoPlayer.current?.currentTime}
            onClick={handleProgressClick}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
