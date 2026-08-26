import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./styles.css";
import EpisodeDetails from "../../components/Podcasts/EpisodeDetails";
import AudioPlayer from "../../components/Podcasts/AudioPlayer";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { podcastService } from "../../services/podcasts/podcastService";
import { authService } from "../../services/auth/authService";

function PodcastDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(-1);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const [playingFile, setPlayingFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };

    loadUser();
  }, []);
  useEffect(() => {
    if (id) {
      getPodcast();
      getEpisodes();
    }
  }, [id]);

  const getPodcast = async () => {
    try {
      const data = await podcastService.getPodcast(id);

      if (!data) {
        toast.error("Podcast not found");
        navigate("/podcasts");
        return;
      }

      setPodcast({ id, ...data });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getEpisodes = async () => {
    try {
      setLoading(true);
      const data = await podcastService.listEpisodes(id);
      setEpisodes(data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleEditEpisode = (episodeId) => {
    navigate(`/episode/${episodeId}/edit`);
  };

  const handleDeleteEpisode = async (episodeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this episode?",
    );

    if (!confirmDelete) return;

    try {
      await podcastService.deleteEpisode(episodeId);

      toast.success("Episode deleted successfully");

      const updatedEpisodes = episodes.filter(
        (episode) => episode.id !== episodeId,
      );

      setEpisodes(updatedEpisodes);

      if (playingEpisode?.id === episodeId) {
        setPlayingEpisode(null);
        setPlayingFile("");
        setCurrentEpisodeIndex(-1);
        setIsPlaying(false);
      }
    } catch (error) {
      toast.error(error.message || "Unable to delete episode");
    }
  };
  const handlePlay = (episode, index) => {
    // Same episode clicked
    if (playingEpisode?.id === episode.id) {
      setIsPlaying((prev) => !prev);
      return;
    }

    setCurrentEpisodeIndex(index);
    setPlayingEpisode(episode);
    setPlayingFile(`http://localhost:5000${episode.audioUrl}`);
    setIsPlaying(true);
  };
  const playPrevious = () => {
    if (currentEpisodeIndex <= 0) return;

    const prev = episodes[currentEpisodeIndex - 1];

    setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    setPlayingEpisode(prev);
    setPlayingFile(`http://localhost:5000${prev.audioUrl}`);
  };
  const playNext = () => {
    if (currentEpisodeIndex >= episodes.length - 1) return;

    const next = episodes[currentEpisodeIndex + 1];

    setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    setPlayingEpisode(next);
    setPlayingFile(`http://localhost:5000${next.audioUrl}`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <Loader />
      </>
    );
  }

  return (
    <>
      <Header />

      {podcast?.id && (
        <div className="podcast-page">
          {/* HERO */}

          <div className="podcast-hero">
            <img
              src={`http://localhost:5000${podcast.bannerUrl}`}
              className="hero-banner"
              alt=""
            />

            <div className="hero-overlay" />

            <div className="hero-content">
              <img
                src={`http://localhost:5000${podcast.thumbnailUrl}`}
                className="hero-thumbnail"
                alt=""
              />

              <div className="hero-info">
                <span className="hero-label">PODCAST</span>

                <h1>{podcast.title}</h1>

                <div className="podcast-meta">
                  {podcast.category && (
                    <span className="podcast-category">{podcast.category}</span>
                  )}

                  <span className="podcast-author">
                    By {podcast.author?.name || "Unknown"}
                  </span>

                  <span className="podcast-date">
                    {new Date(podcast.createdAt).toLocaleDateString()}
                  </span>

                  <span
                    className={`podcast-status ${
                      podcast.isPublished ? "published" : "draft"
                    }`}
                  >
                    {podcast.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <p>{podcast.description}</p>
              </div>
              {user?.id == podcast.createdBy && (
                <Button
                  width="180px"
                  text="Create Episode"
                  onClick={() => navigate(`/podcast/${id}/create-episode`)}
                />
              )}
            </div>
          </div>

          {/* MAIN CONTENT */}

          <div className="podcast-content">
            {/* LEFT */}

            <div className="episode-column">
              <h2 className="section-title">Episodes ({episodes.length})</h2>

              {episodes.length ? (
                episodes.map((episode, index) => (
                  <EpisodeDetails
                    key={episode.id}
                    id={episode.id}
                    index={index + 1}
                    title={episode.title}
                    description={episode.description}
                    audioFile={`http://localhost:5000${episode.audioUrl}`}
                    isActive={playingEpisode?.id === episode.id}
                    isPlaying={isPlaying}
                    onClick={() => handlePlay(episode, index)}
                    canManage={user?.id === podcast.createdBy}
                    onEdit={handleEditEpisode}
                    onDelete={handleDeleteEpisode}
                    duration={episode.duration}
                  image={`http://localhost:5000${podcast.thumbnailUrl}`}

                  />
                ))
              ) : (
                <div className="empty-card">
                  <h3>No Episodes Yet</h3>

                  <p>Create your first episode to start your podcast.</p>
                </div>
              )}
            </div>

            {/* RIGHT */}
            {episodes.length > 0 && (
              <div className="player-column">
                <div className="player-card">
                  <h2 className="section-title">Now Playing</h2>

                  {playingEpisode ? (
                    <AudioPlayer
                      audioSrc={playingFile}
                      image={`http://localhost:5000${podcast.thumbnailUrl}`}
                      episodeTitle={playingEpisode.title}
                      onPrevious={playPrevious}
                      onNext={playNext}
                      hasPrevious={currentEpisodeIndex > 0}
                      hasNext={currentEpisodeIndex < episodes.length - 1}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                    />
                  ) : (
                    <div className="player-placeholder">
                      <img
                        src={`http://localhost:5000${podcast.thumbnailUrl}`}
                        className="placeholder-img"
                        alt=""
                      />

                      <h3>Select an Episode</h3>

                      <p>Click any episode from the left to start listening.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PodcastDetailsPage;
