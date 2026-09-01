import React, { useState } from "react";
import InputComponent from "../../common/Input";
import Button from "../../common/Button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../../../context/AppContext";
import { authService } from "../../../services/auth/authService";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user, accessToken, refreshToken } = response;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser({ id: user.id, name: user.name, email: user.email });
      toast.success("Logged in successfully");
      navigate("/profile");
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
      <Button
        text={loading ? "Logging in..." : "Login"}
        onClick={handleLogin}
        disabled={loading}
      />
      <Link to="/forgot-password" style={{ color: "#fff" }}>
        Forgot Password?
      </Link>
    </>
  );
}

export default LoginForm;
