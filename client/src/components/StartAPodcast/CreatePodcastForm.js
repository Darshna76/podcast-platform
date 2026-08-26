import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputComponent from "../common/Input";
import { toast } from "react-toastify";
import Button from "../common/Button";
import FileInput from "../common/Input/FileInput";

import { podcastService } from "../../services/podcasts/podcastService";
import SelectComponent from "../common/Select";

function CreatePodcastForm({ editMode = false, podcastData = null }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [displayImage, setDisplayImage] = useState();
  const [bannerImage, setBannerImage] = useState();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [displayImagePreview, setDisplayImagePreview] = useState("");
  const [bannerImagePreview, setBannerImagePreview] = useState("");
  const navigate = useNavigate();
  const categoryOptions = [
    { label: "Technology", value: "Technology" },
    { label: "Education", value: "Education" },
    { label: "Business", value: "Business" },
    { label: "Comedy", value: "Comedy" },
    { label: "Health", value: "Health" },
    { label: "Sports", value: "Sports" },
    { label: "Music", value: "Music" },
    { label: "News", value: "News" },
  ];
  useEffect(() => {
    if (editMode && podcastData) {
      setTitle(podcastData.title || "");
      setDesc(podcastData.description || "");
      setCategory(podcastData.category || "");
      setIsPublished(podcastData.isPublished || false);

      setDisplayImagePreview(
        podcastData.thumbnailUrl
  ? `${process.env.REACT_APP_IMAGE_URL}${podcastData.thumbnailUrl}`
  : ""
      );

      setBannerImagePreview(
        podcastData.thumbnailUrl
  ? `${process.env.REACT_APP_IMAGE_URL}${podcastData.thumbnailUrl}`
  : ""
      );
    }
  }, [editMode, podcastData]);
  useEffect(() => {
    return () => {
      if (displayImagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(displayImagePreview);
      }

      if (bannerImagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(bannerImagePreview);
      }
    };
  }, [displayImagePreview, bannerImagePreview]);
  const handleSubmit = async () => {
    if (!title || !desc || !category) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", desc);
      formData.append("category", category);
      formData.append("isPublished", isPublished);

      if (displayImage) {
        formData.append("thumbnail", displayImage);
      }

      if (bannerImage) {
        formData.append("banner", bannerImage);
      }

      let response;

      if (editMode) {
        response = await podcastService.updatePodcast(podcastData.id, formData);

        toast.success("Podcast updated successfully");
      } else {
        response = await podcastService.createPodcast(formData);

        toast.success("Podcast created successfully");
      }

      navigate(`/podcast/${response.id || podcastData.id}`);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const displayImageHandle = (file) => {
    setDisplayImage(file);

    if (file) {
      setDisplayImagePreview(URL.createObjectURL(file));
    } else {
      setDisplayImagePreview("");
    }
  };

  const bannerImageHandle = (file) => {
    setBannerImage(file);

    if (file) {
      setBannerImagePreview(URL.createObjectURL(file));
    } else {
      setBannerImagePreview("");
    }
  };

  return (
    <>
      <InputComponent
        state={title}
        setState={setTitle}
        placeholder="Title"
        type="text"
        required={true}
      />
      <InputComponent
        state={desc}
        setState={setDesc}
        placeholder="Description"
        type="text"
        required={true}
      />
      <SelectComponent
        state={category}
        setState={setCategory}
        options={categoryOptions}
        placeholder="Select Category"
        required={true}
      />
      <div style={{ margin: "1rem 0" }}>
        <p
          style={{
            color: "var(--white)",
            fontSize: "0.95rem",
            fontWeight: "600",
            marginBottom: "0.8rem",
          }}
        >
          Status
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.8rem 1rem",
              border: `2px solid ${
                !isPublished ? "var(--blue)" : "var(--purple-grey)"
              }`,
              borderRadius: "8px",
              background: "var(--theme)",
              color: "var(--white)",
              cursor: "pointer",
              transition: "0.3s",
              flex: 1,
            }}
          >
            <input
              type="radio"
              name="status"
              checked={!isPublished}
              onChange={() => setIsPublished(false)}
              style={{
                accentColor: "var(--blue)",
                cursor: "pointer",
              }}
            />
            <span>Draft</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.8rem 1rem",
              border: `2px solid ${
                isPublished ? "var(--blue)" : "var(--purple-grey)"
              }`,
              borderRadius: "8px",
              background: "var(--theme)",
              color: "var(--white)",
              cursor: "pointer",
              transition: "0.3s",
              flex: 1,
            }}
          >
            <input
              type="radio"
              name="status"
              checked={isPublished}
              onChange={() => setIsPublished(true)}
              style={{
                accentColor: "var(--blue)",
                cursor: "pointer",
              }}
            />
            <span>Published</span>
          </label>
        </div>
      </div>
      {displayImagePreview && (
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              color: "white",
              marginBottom: "10px",
            }}
          >
            {editMode ? "Current Display Image" : "Selected Display Image"}
          </p>

          <img
            src={displayImagePreview}
            alt="Display"
            style={{
              width: "180px",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "2px solid #444",
            }}
          />
        </div>
      )}
      <FileInput
        accept={"image/*"}
        id="display-image-input"
        fileHandleFnc={displayImageHandle}
        text={"Display Image Upload"}
      />
      {bannerImagePreview && (
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              color: "white",
              marginBottom: "10px",
            }}
          >
            {editMode ? "Current Banner Image" : "Selected Banner Image"}
          </p>

          <img
            src={bannerImagePreview}
            alt="Banner"
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "2px solid #444",
            }}
          />
        </div>
      )}

      <FileInput
        accept={"image/*"}
        id="banner-image-input"
        fileHandleFnc={bannerImageHandle}
        text={"Banner Image Upload"}
      />

      <Button
        text={
          loading
            ? "Loading..."
            : editMode
              ? "Update Podcast"
              : "Create Podcast"
        }
        disabled={loading}
        onClick={handleSubmit}
      />
    </>
  );
}

export default CreatePodcastForm;
