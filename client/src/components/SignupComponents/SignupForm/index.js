import React, { useState } from "react";
import InputComponent from "../../common/Input";
import Button from "../../common/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../../../context/AppContext";
import { authService } from "../../../services/auth/authService";
import FileInput from "../../common/Input/FileInput";

function SignupForm({ setFlag }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const profileImageHandle = (file) => {
    setProfileImage(file);
  };

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("password", password);

      if (profileImage) {
        formData.append("avatar", profileImage);
      }

      const response = await authService.register(formData);

      const { user, accessToken, refreshToken } = response;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUser(user);

      toast.success("Account created successfully login to continue!");

      // navigate("/");
      setFlag(true); 
    } catch (error) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <div className="page">
        <div className="page-card"> */}
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
        placeholder="Email"
        type="email"
        required
      />

      <InputComponent
        state={password}
        setState={setPassword}
        placeholder="Password"
        type="password"
        required
      />

      <InputComponent
        state={confirmPassword}
        setState={setConfirmPassword}
        placeholder="Confirm Password"
        type="password"
        required
      />

      <FileInput
        accept="image/*"
        id="profile-image-input"
        fileHandleFnc={profileImageHandle}
        text="Upload Profile Image"
      />

      {profileImage && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <img
            src={URL.createObjectURL(profileImage)}
            alt="Profile Preview"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #6C63FF",
            }}
          />
        </div>
      )}

      <Button
        text={loading ? "Creating Account..." : "Sign Up"}
        onClick={handleSignup}
        disabled={loading}
      />
      {/* </div>
      </div> */}
    </>
  );
}

export default SignupForm;