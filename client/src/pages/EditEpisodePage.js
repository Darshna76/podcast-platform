import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/common/Header";
import Loader from "../components/common/Loader";
import { podcastService } from "../services/podcasts/podcastService";
import { toast } from "react-toastify";
import EpisodeForm from "./EpisodeForm";

function EditEpisodePage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [episode, setEpisode] = useState(null);

  useEffect(() => {
    console.log('id',id)
    const fetchEpisode = async () => {
      try {
        const data = await podcastService.getEpisode(
          id
        );

        setEpisode(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [id]);

  if (loading) return <Loader />;

  return (
   
          <EpisodeForm
            editMode={true}
            episodeData={episode}
            podcastId={episode.podcastId}
      />
  );
}

export default EditEpisodePage;