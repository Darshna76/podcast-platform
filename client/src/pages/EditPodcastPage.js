import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { podcastService } from "../services/podcasts/podcastService";
import Header from "../components/common/Header";
import CreatePodcastForm from "../components/StartAPodcast/CreatePodcastForm";
import Loader from "../components/common/Loader";

function EditPodcastPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const data = await podcastService.getPodcast(id);
        setPodcast({ id, ...data });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <>
      <Header />

       <div className="page">
      <div className="page-card">
        <h1>Edit Podcast</h1>

        <CreatePodcastForm editMode={true} podcastData={podcast} />
              </div>

      </div>
    </>
  );
}

export default EditPodcastPage;
