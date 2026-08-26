import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import InputComponent from "../components/common/Input";
import { podcastService } from "../services/podcasts/podcastService";
import { toast } from "react-toastify";
import PodcastCard from "../components/Podcasts/PodcastCard";
import Loader from "../components/common/Loader";
import { useAppContext } from "../context/AppContext";

function PodcastsPage() {
  const [search, setSearch] = useState("");
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { user } = useAppContext();

  useEffect(() => {
    const loadPodcasts = async () => {
      setLoading(true);
      try {
      const response = await podcastService.listPodcasts();

      const podcastList = response.rows || response || [];

      const publishedPodcasts = podcastList.filter(
        (podcast) => podcast.isPublished === true
      );

      setPodcasts(publishedPodcasts);
    }  catch (error) {
        toast.error(error.message || "Unable to load podcasts");
      } finally {
        setLoading(false);
      }
    };

    loadPodcasts();
  }, []);
  const categories = [
    "All",
    ...new Set(podcasts.map((podcast) => podcast.category).filter(Boolean)),
  ];
  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch = podcast.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || podcast.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  const handleDeletePodcast = (id) => {
    setPodcasts((prev) => prev.filter((podcast) => podcast.id !== id));
  };
  return (
    <div>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <div className="input-wrapper" style={{ marginTop: "2rem" }}>
          <h1>Discover Podcasts</h1>
          <div style={{ width: "70%" }}>
            <InputComponent
              state={search}
              setState={setSearch}
              placeholder="Search by title"
            />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              margin: "1.5rem 0 2rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: "10px 22px",
                  borderRadius: "30px",
                  border:
                    selectedCategory === category
                      ? "1px solid #3b82f6"
                      : "1px solid var(--purple-grey)",
                  background:
                    selectedCategory === category ? "#3b82f6" : "transparent",
                  color:
                    selectedCategory === category ? "#fff" : "var(--white)",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  boxShadow:
                    selectedCategory === category
                      ? "0 4px 12px rgba(59,130,246,0.35)"
                      : "none",
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredPodcasts.length > 0 ? (
            <div className="podcasts-flex" style={{ marginTop: "1.5rem" }}>
              {filteredPodcasts.map((item) => {
                return (
                  <PodcastCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    displayImage={item.thumbnailUrl}
                    description={item.description}
                    category={item.category}
                    author={item.author}
                    createdAt={item.createdAt}
                    isPublished={item.isPublished}
                    createdBy={item.createdBy}
                    currentUserId={user?.id}
                    onDelete={handleDeletePodcast}
                  />
                );
              })}
            </div>
          ) : (
            <p>
              {search ? "Podcast Not Found" : "No Podcasts On The Platform"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PodcastsPage;
