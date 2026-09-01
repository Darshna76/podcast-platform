import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import InputComponent from "../../components/common/Input";
import Header from "../../components/common/Header";
import { authService } from "../../services/auth/authService";
import "./styles.css";

function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const storedEmail =
    sessionStorage.getItem("forgotPasswordEmail") ||
    location.state?.email ||
    "";

  const [email, setEmail] = useState(storedEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleVerifyOtp = async () => {
    if (!email || !otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.verifyOTP({ email, otp });
      sessionStorage.setItem("forgotPasswordEmail", email);
      sessionStorage.setItem("forgotPasswordOTP", otp);
      toast.success(result.message || "OTP verified successfully.");
      navigate("/reset-password", { state: { email, otp } });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "OTP verification failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Please provide your email address first.");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.resendOTP({ email });
      toast.success(result.message || "A new OTP has been sent.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to resend OTP.",
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
          <h2 className="auth-heading">Verify OTP</h2>
          <p className="auth-subtitle">
            Enter the 6-digit code sent to <strong>{email}</strong>.
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

            <Button
              text={loading ? "Verifying..." : "Verify OTP"}
              onClick={handleVerifyOtp}
              disabled={loading}
            />

            <div
              className="inline-row"
              style={{ marginBottom: "10px", cursor: "pointer" }}
            >
              <span className="auth-meta">Didn't receive the code?{" "}</span>
              <span className="inline-link" onClick={handleResendOtp}>
                Resend OTP
              </span>
            </div>

            <Link
              to="/forgot-password"
              className="auth-link"
              style={{ color: "#fff" }}
            >
              Change email
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyOtpPage;
