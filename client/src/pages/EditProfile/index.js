import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Header from "../../components/common/Header";
import InputComponent from "../../components/common/Input";
import FileInput from "../../components/common/Input/FileInput";
import Button from "../../components/common/Button";
import { authService } from "../../services/auth/authService";
import "./styles.css";

function EditProfile() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const user = await authService.getCurrentUser();

      setFullName(user.name || "");
      setEmail(user.email || "");
      setBio(user.bio || "");

      if (user.avatarUrl) {
        setPreviewImage(
          `${process.env.REACT_APP_IMAGE_URL || "http://localhost:5000"}${user.avatarUrl}`,
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to load profile.");
    }
  };

  const profileImageHandle = (file) => {
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!fullName || !email) {
      toast.error("Name and Email are required.");
      return;
    }


    // Update API
    setLoading(true);
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("bio", bio);
    if (profileImage) {
      formData.append("avatar", profileImage);
    }

    try {
      await authService.updateUser(formData);
      toast.success("Profile updated successfully.");
      navigate("/profile");
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="edit-profile-page">
        <div className="edit-profile-card">
          <h1>Edit Profile</h1>

          <p className="subtitle">Keep your personal information up to date.</p>

          <div className="profile-preview">
            <img
              src={
                previewImage ||
                "https://ui-avatars.com/api/?name=User&background=6C63FF&color=fff"
              }
              alt="Profile"
            />
          </div>

          <InputComponent
            state={fullName}
            setState={setFullName}
            placeholder="Full Name"
            type="text"
            required
          />

          <InputComponent
            state={email}
            setState={setEmail}
            placeholder="Email Address"
            type="email"
            required
          />

          <InputComponent
            state={bio}
            setState={setBio}
            placeholder="Tell us about yourself"
            type="text"
          />

          <FileInput
            accept="image/*"
            id="profile-image"
            fileHandleFnc={profileImageHandle}
            text="Upload New Profile Image"
          />

          <div className="button-wrapper">
            <Button
              text={loading ? "Updating..." : "Save Changes"}
              onClick={handleUpdate}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
