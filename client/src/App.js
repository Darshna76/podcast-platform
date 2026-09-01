import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUpPage from "./pages/SignUpPage";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoutes from "./components/common/PrivateRoutes";
import CreateAPodcastPage from "./pages/CreateAPodcast";
import PodcastsPage from "./pages/Podcasts";
import PodcastDetailsPage from "./pages/PodcastDetails";
import EditProfileForm from "./pages/EditProfile";
import EditPodcastPage from "./pages/EditPodcastPage";
import EpisodeForm from "./pages/EpisodeForm";
import EditEpisodePage from "./pages/EditEpisodePage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPassword";
import VerifyOtpPage from "./pages/ForgotPassword/VerifyOtpPage";
import ResetPasswordPage from "./pages/ForgotPassword/ResetPasswordPage";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfileForm />} />
            <Route path="/create-a-podcast" element={<CreateAPodcastPage />} />
            <Route path="/podcast/:id/edit" element={<EditPodcastPage />} />
            <Route path="/podcasts" element={<PodcastsPage />} />
            <Route path="/podcast/:id" element={<PodcastDetailsPage />} />
            <Route
              path="/podcast/:id/create-episode"
              element={<EpisodeForm />}
            />
            <Route path="/episode/:id/edit" element={<EditEpisodePage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
