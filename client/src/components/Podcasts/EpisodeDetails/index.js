import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaClock,
  FaHeadphones,
  FaEdit,
  FaTrash,
  FaEllipsisV,
} from "react-icons/fa";
import "./styles.css";

function EpisodeDetails({
  id,
  index,
  title,
  description,
  audioFile,
  onClick,
  isPlaying,
  isActive,
  canManage,
  onEdit,
  onDelete,
  duration,
  image,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const formatDuration = (seconds) => {
    if (!seconds) return "--";

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${String(secs).padStart(2, "0")}`;
  };
  return (
    <div
      className={`episode-card ${isActive ? "active-episode" : ""}`}
      onClick={() => onClick(audioFile)}
    >
      <div className="episode-left">
        <img src={image} alt="" className="episode-number" />
        <div className="episode-info">
          <h3>{title}</h3>

          <p>{description}</p>

          <div className="episode-meta">
            <span>
              <FaHeadphones />
              Podcast Episode
            </span>

            <span>
              <FaClock />
              {formatDuration(duration)}
            </span>
          </div>
        </div>
      </div>
      {canManage && (
        <div
          className="episode-menu"
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="episode-menu-btn"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <FaEllipsisV />
          </button>

          {showMenu && (
            <div className="episode-dropdown">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(id);
                }}
              >
                <FaEdit />
                <span>Edit</span>
              </button>

              <button
                className="delete"
                onClick={() => {
                  setShowMenu(false);
                  onDelete(id);
                }}
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
      <button className={`episode-play-btn ${isActive ? "playing-btn" : ""}`}>
        {isActive && isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>
  );
}

export default EpisodeDetails;
