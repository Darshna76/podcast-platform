import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import InputComponent from "../../components/common/Input";
import Header from "../../components/common/Header";
// import { authService } from "../../services/auth/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      // Connect API here
      // await authService.forgotPassword({ email });

      setSubmitted(true);
      toast.success("Password reset link sent successfully.");
    } catch (error) {
      toast.error(error.message || "Unable to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="page">
        <div className="page-card">
          {!submitted ? (
            <>
              <h2>Forgot Password?</h2>

              <p>
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              <InputComponent
                state={email}
                setState={setEmail}
                placeholder="Email"
                type="email"
                required
              />

              <Button
                text={loading ? "Sending..." : "Send Reset Link"}
                onClick={handleForgotPassword}
                disabled={loading}
              />

              <Link to="/">
                <p style={{ cursor: "pointer" }}>Back to Login</p>
              </Link>
            </>
          ) : (
            <>
              <h2>Check Your Email</h2>

              <p>
                We've sent a password reset link to <strong>{email}</strong>.
              </p>

              <Button text="Try Again" onClick={() => setSubmitted(false)} />
<p style={{ cursor: "pointer" }} >
              <Link style={{color:"#ffff"}} to="/"> 
            Back to Login
          </Link></p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
