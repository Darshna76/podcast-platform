// import React from "react";
// import "./styles.css";
// import { Link } from "react-router-dom";
// import { FaPlay } from "react-icons/fa";

// function PodcastCard({
//   id,
//   title,
//   displayImage,
//   description,
//   category,
//   author,
// }) {
//   return (
//     <Link to={`/podcast/${id}`} className="podcast-link">
//       <div className="podcast-card">
//         <div className="podcast-image-wrapper">
//           <img
//             className="display-image-podcast"
//             src={"http://localhost:5000" + displayImage}
//             alt={title}
//           />

//           <div className="play-overlay">
//             <FaPlay />
//           </div>
//         </div>

//         <div className="podcast-body">
//           <div className="podcast-header">
//             <div>
//               <h3 className="podcast-title">{title}</h3>

//               <p className="podcast-author">
//                 By {author?.name || "Unknown"}
//               </p>
//             </div>

//             {category && (
//               <span className="category-chip">
//                 {category}
//               </span>
//             )}
//           </div>

//           <p className="podcast-description">
//             {description
//               ? description.length > 65
//                 ? description.substring(0, 65) + "..."
//                 : description
//               : "No description available"}
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default PodcastCard;
import React,  { useEffect, useRef, useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaEdit, FaTrash,  FaEllipsisV,
 } from "react-icons/fa";
import { toast } from "react-toastify";
import { podcastService } from "../../../services/podcasts/podcastService";

function PodcastCard({
  id,
  title,
  displayImage,
  description,
  category,
  author,
  createdBy,
  currentUserId,
  onDelete,
  isPublished
}) {
  const navigate = useNavigate();
const [showMenu, setShowMenu] = useState(false);
const menuRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);
  const handleCardClick = () => {
    navigate(`/podcast/${id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/podcast/${id}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this podcast?"
    );

    if (!confirmDelete) return;

    try {
      await podcastService.deletePodcast(id);

      toast.success("Podcast deleted successfully");

      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      toast.error(error.message || "Unable to delete podcast");
    }
  };

  return (
    <div
      className="podcast-link"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="podcast-card">
        <div className="podcast-image-wrapper">
          <img
            className="display-image-podcast"
            src={"http://localhost:5000" + displayImage}
            alt={title}
          />

          <div className="play-overlay">
            <FaPlay />
          </div>
        </div>

        <div className="podcast-body">
          <div className="podcast-header">
            <div>
              <h3 className="podcast-title">{title}</h3>

              <p className="podcast-author">
                By {author?.name || "Unknown"}
              </p>
            </div>

            <div className="podcast-badges">
  {category && (
    <span className="category-chip">
      {category}
    </span>
  )}

  <span
    className={`publish-status ${
      isPublished ? "published" : "draft"
    }`}
  >
    {isPublished ? "Published" : "Draft"}
  </span>
</div>
            
          </div>

          <p className="podcast-description">
            {description
              ? description.length > 65
                ? description.substring(0, 65) + "..."
                : description
              : "No description available"}
          </p>

         {createdBy === currentUserId && (
  <div
    className="podcast-menu"
    ref={menuRef}
    onClick={(e) => e.stopPropagation()}
  >
    <button
      className="podcast-menu-btn"
      onClick={() => setShowMenu((prev) => !prev)}
    >
      <FaEllipsisV />
    </button>

    {showMenu && (
      <div className="podcast-dropdown">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(false);
            handleEdit(e);
          }}
        >
          <FaEdit />
          <span>Edit Podcast</span>
        </button>

        <button
          className="delete"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(false);
            handleDelete(e);
          }}
        >
          <FaTrash />
          <span>Delete Podcast</span>
        </button>
      </div>
    )}
  </div>
)}

        </div>
      </div>
    </div>
  );
}

export default PodcastCard;