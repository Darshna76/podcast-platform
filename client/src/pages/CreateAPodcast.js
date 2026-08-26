// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/common/Header";
// import InputComponent from "../components/common/Input";
// import Button from "../components/common/Button";
// import { podcastService } from "../services/podcasts/podcastService";
// import { toast } from "react-toastify";

// function CreateAPodcastPage() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleCreate = async () => {
//     if (!title || !description) {
//       toast.error("Please fill in the title and description");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await podcastService.createPodcast({
//         title,
//         description,
//       });
//       toast.success("Podcast created successfully");
//       navigate(`/podcast/${response.podcast?.id || response.id}`);
//     } catch (error) {
//       toast.error(error.message || "Could not create podcast");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <div className="page">
//         <div className="page-card">
//           {" "}
//           <h1>Create A Podcast</h1>
//           <InputComponent
//             state={title}
//             setState={setTitle}
//             placeholder="Podcast title"
//           />
//           <InputComponent
//             state={description}
//             setState={setDescription}
//             placeholder="Podcast description"
//           />
//           <Button
//             text={loading ? "Creating..." : "Create podcast"}
//             disabled={loading}
//             onClick={handleCreate}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateAPodcastPage;

import React from "react";
import Header from "../components/common/Header";
import CreatePodcastForm from "../components/StartAPodcast/CreatePodcastForm";

function CreateAPodcastPage() {
  return (
    <div>
      <Header />
      <div className="page">
      <div className="page-card">
        <h1>Create A Podcast</h1>
        <CreatePodcastForm />
      </div>
            </div>

    </div>
  );
}

export default CreateAPodcastPage;
