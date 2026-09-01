import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import InputComponent from "../../components/common/Input";
import Header from "../../components/common/Header";
import { authService } from "../../services/auth/authService";
import "./styles.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      sessionStorage.setItem("forgotPasswordEmail", email);
      toast.success(response.message || "OTP sent successfully.");
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to send OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="page">
        <div className="page-card auth-card">
          <h2 className="auth-heading">Forgot Password?</h2>

          <p className="auth-subtitle">
            Enter your email address and we'll send you a 6-digit code to reset
            your password.
          </p>

          <div className="auth-form">
            <InputComponent
              state={email}
              setState={setEmail}
              placeholder="Email"
              type="email"
              required
            />

            <Button
              text={loading ? "Sending OTP..." : "Send OTP"}
              onClick={handleForgotPassword}
              disabled={loading}
            />

            <Link to="/" className="auth-link" style={{ color: "#fff" }}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
