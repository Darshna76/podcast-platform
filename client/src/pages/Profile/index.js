import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import { Link } from "react-router-dom";
import {
  FaPodcast,
  FaEdit,
  FaMicrophone,
  FaPlayCircle,
  FaUsers,
} from "react-icons/fa";
import { authService } from "../../services/auth/authService";
import "./styles.css";
import PodcastCard from "../../components/Podcasts/PodcastCard";
import { podcastService } from "../../services/podcasts/podcastService";
import Loader from "../../components/common/Loader";
function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [podcasts, setPodcasts] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        const response = await podcastService.listPodcasts();

        const myPodcasts = response.rows.filter(
          (podcast) => podcast.createdBy === currentUser.id,
        );

        setPodcasts(myPodcasts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
const handleDeletePodcast = (id) => {
    setPodcasts((prev) => prev.filter((podcast) => podcast.id !== id));
  };
  return (
    <div>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "0.3rem",
            }}
          >
            {user && (
              <div className="profile-header">
                <div className="profile-image-wrapper">
                  <img
                    src={
                      user.avatarUrl
                        ? `http://localhost:5000${user.avatarUrl}`
                        : "/default-avatar.png"
                    }
                    alt={user.name}
                    className="profile-image"
                  />

                  <Link to="/edit-profile" className="edit-profile-btn">
                    <FaEdit />
                  </Link>
                </div>

                <h2>{user.name}</h2>

                <p>{user.email}</p>

                <span className="profile-role">
                  {user.role === "admin" ? "Administrator" : "Creator"}
                </span>
              </div>
            )}
          </div>

          <h1 style={{ marginBottom: "1rem", marginTop: "0" }}>My Podcasts</h1>
          <div className="podcast-flex">
            {podcasts?.length == 0 ? (
              <p style={{ fontSize: "1.2rem" }}>No Podcasts Available</p>
            ) : (
              <>
                {podcasts?.map((podcast) => (
                  <PodcastCard
                    key={podcast.id}
                    id={podcast.id}
                    title={podcast.title}
                    displayImage={podcast.thumbnailUrl}
                    category={podcast.category}
                    author={podcast.author}
                    description={podcast.description}
                    createdAt={podcast.createdAt}
                    isPublished={podcast.isPublished}
                     createdBy={podcast.createdBy}
                    currentUserId={user?.id}
                    onDelete={handleDeletePodcast}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
