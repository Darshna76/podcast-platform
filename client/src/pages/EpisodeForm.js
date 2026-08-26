import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import InputComponent from "../components/common/Input";
import Button from "../components/common/Button";
import { podcastService } from "../services/podcasts/podcastService";
import { toast } from "react-toastify";
import FileInput from "../components/common/Input/FileInput";

function EpisodeForm({
  editMode = false,
  episodeData = null,
  podcastId = null,
}) {
    const { id } = useParams();
const currentPodcastId = podcastId || id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
const [audioPreview, setAudioPreview] = useState("");
const [duration, setDuration] = useState(null);
 useEffect(() => {
  if (editMode && episodeData) {
    setTitle(episodeData.title || "");
    setDescription(episodeData.description || "");
    setAudioPreview(`${process.env.REACT_APP_IMAGE_URL}${episodeData.audioUrl}`);
  }
}, [editMode, episodeData]);
 const handleSubmit = async () => {
  if (!title || !description) {
    toast.error("Please fill all required fields.");
    return;
  }

  if (!editMode && !audioFile) {
    toast.error("Please upload an audio file.");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    if (duration !== null) {
  formData.append("duration", duration);
}

    if (audioFile) {
      formData.append("audio", audioFile);
    }

    let response;

    if (editMode) {
      response = await podcastService.updateEpisode(
        episodeData.id,
        formData
      );

      toast.success("Episode updated successfully");

      navigate(`/podcast/${currentPodcastId}`);
    } else {
      response = await podcastService.createEpisode(
        currentPodcastId,
        formData
      );

      toast.success("Episode created successfully");

      navigate(`/podcast/${currentPodcastId}`);
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        error.message ||
        "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};
 const audioFileHandle = (file) => {
  setAudioFile(file);

  if (!file) {
    setAudioPreview("");
    setDuration(null);
    return;
  }

  const previewUrl = URL.createObjectURL(file);
  setAudioPreview(previewUrl);

  const audio = new Audio(previewUrl);

  audio.addEventListener("loadedmetadata", () => {
    setDuration(Math.round(audio.duration)); // duration in seconds
  });
};

  return (
    <div>
      <Header />

      <div className="page">
        <div className="page-card">
<h1>
  {editMode ? "Edit Episode" : "Create Episode"}
</h1>         <p>Podcast ID: {currentPodcastId}</p>

          <div className="mb-3">
            <InputComponent
              state={title}
              setState={setTitle}
              placeholder="Episode title"
            />
          </div>

          <div className="mb-3">
            <InputComponent
              state={description}
              setState={setDescription}
              placeholder="Episode description"
            />
          </div>
{audioPreview && (
  <div
    style={{
      marginBottom: "15px",
      color: "white",
    }}
  >
    <p>{editMode ? "Current Audio" : "Selected Audio"}</p>

    <audio
      key={audioPreview}
      controls
      src={audioPreview}
      style={{
        width: "100%",
        marginTop: "8px",
      }}
    />
  </div>
)}
          <FileInput
            accept={"audio/*"}
            id="audio-file-input"
            fileHandleFnc={audioFileHandle}
            text={"Upload Audio File"}
          />

        <Button
    text={
        loading
            ? "Loading..."
            : editMode
            ? "Update Episode"
            : "Create Episode"
    }
            disabled={loading}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default EpisodeForm;
