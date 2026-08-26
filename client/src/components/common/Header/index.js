import React from "react";
import "./styles.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../../../context/AppContext";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
const { user, setUser } = useAppContext();

  const currentPath = location.pathname;


 const handleLogout = () => {
  setUser(null);
  toast.success("Logged out successfully");
  navigate("/login");
};
  return (
    <div className="navbar">
      <div className="gradient"></div>

      <div className="links">
        <Link to="/" className={currentPath === "/" ? "active" : ""}>
          Signup
        </Link>

        <Link
          to="/podcasts"
          className={currentPath === "/podcasts" ? "active" : ""}
        >
          Podcasts
        </Link>

        <Link
          to="/create-a-podcast"
          className={currentPath === "/create-a-podcast" ? "active" : ""}
        >
          Start A Podcast
        </Link>

        <Link
          to="/profile"
          className={currentPath === "/profile" ? "active" : ""}
        >
          Profile
        </Link>

       {user && (
         
           <Link
          onClick={handleLogout}
        >
           Logout
        </Link>
       )}
      </div>
    </div>
  );
}

export default Header;