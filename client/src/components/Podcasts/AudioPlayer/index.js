import React, { useEffect, useRef, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaStepBackward,
  FaStepForward,
  FaHeart,
} from "react-icons/fa";
import "./styles.css";

function AudioPlayer({
  audioSrc,
  image,
  episodeTitle,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  isPlaying,
  setIsPlaying,
}) {
  const audioRef = useRef();

  const [mute, setMute] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.load();

    setCurrent(0);
    setDuration(0);

    audioRef.current.play().catch(() => {});
    setIsPlaying(true);
  }, [audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;

    const update = () => setCurrent(audio.currentTime);

    const loaded = () => {
      setDuration(audio.duration);
    };
    const ended = () => {
      setIsPlaying(false);
      setCurrent(0);

      if (hasNext) {
        onNext();
      }
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", loaded);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", loaded);
      audio.removeEventListener("ended", ended);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const format = (time) => {
    if (!time) return "0:00";

    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);

    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="spotify-player">
      <audio ref={audioRef}>
        <source src={audioSrc} />
      </audio>

      <img
        src={image}
        alt=""
        className={`album-art ${isPlaying ? "spin" : ""}`}
      />

      <h2>{episodeTitle}</h2>

      <p>Podcast Episode</p>

      <div className={`wave-bars ${isPlaying ? "playing" : "paused"}`}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="progress">
        <span>{format(current)}</span>

        <input
          type="range"
          min="0"
          max={duration}
          value={current}
          step="0.01"
          onChange={(e) => {
            audioRef.current.currentTime = e.target.value;
            setCurrent(e.target.value);
          }}
        />

        <span>{format(duration)}</span>
      </div>

      <div className="controls">
        <button disabled={!hasPrevious} onClick={onPrevious}>
          <FaStepBackward />
        </button>

        <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <button disabled={!hasNext} onClick={onNext}>
          <FaStepForward />
        </button>
      </div>

      <div className="bottom-controls">
        <button>
          <FaHeart />
        </button>

        <button
          onClick={() => {
            setMute(!mute);

            if (!mute) {
              setVolume(0);
            } else {
              setVolume(1);
            }
          }}
        >
          {mute ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>

        <input
          type="range"
          value={volume}
          max={1}
          min={0}
          step={0.01}
          onChange={(e) => {
            setVolume(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
