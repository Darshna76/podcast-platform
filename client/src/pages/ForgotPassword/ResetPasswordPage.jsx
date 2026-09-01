import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import InputComponent from "../../components/common/Input";
import Header from "../../components/common/Header";
import { authService } from "../../services/auth/authService";
import "./styles.css";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const storedEmail =
    sessionStorage.getItem("forgotPasswordEmail") ||
    location.state?.email ||
    "";
  const storedOtp =
    sessionStorage.getItem("forgotPasswordOTP") || location.state?.otp || "";

  const [email, setEmail] = useState(storedEmail);
  const [otp, setOtp] = useState(storedOtp);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  const handleResetPassword = async () => {
    if (!email || !otp) {
      toast.error(
        "OTP verification is required before resetting your password.",
      );
      navigate("/forgot-password");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please enter your new password and confirm it.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.resetPassword({
        email,
        otp,
        password,
      });

      sessionStorage.removeItem("forgotPasswordEmail");
      sessionStorage.removeItem("forgotPasswordOTP");
      toast.success(result.message || "Password reset successfully.");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to reset password.",
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
          <h2 className="auth-heading">Reset Password</h2>
          <p className="auth-subtitle">
            Create a new password for <strong>{email}</strong>.
          </p>

          <div className="auth-form">
            <InputComponent
              state={email}
              setState={setEmail}
              placeholder="Email"
              type="email"
              required
            />
            <InputComponent
              state={otp}
              setState={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
              placeholder="OTP"
              type="text"
              required
            />
            <div className="password-stack">
              <InputComponent
                state={password}
                setState={setPassword}
                placeholder="New password"
                type="password"
                required
              />
              <InputComponent
                state={confirmPassword}
                setState={setConfirmPassword}
                placeholder="Confirm password"
                type="password"
                required
              />
            </div>

            <Button
              text={loading ? "Resetting..." : "Reset Password"}
              onClick={handleResetPassword}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPasswordPage;
