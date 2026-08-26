import express from "express";
import {
  createEpisode,
  createPodcast,
  deleteEpisode,
  deletePodcast,
  getPodcast,
  listEpisodes,
  listPodcasts,
  updateEpisode,
  updatePodcast,
  getEpisode,
} from "../controllers/podcast.controller.js";
import { authenticate } from "../../../shared/middleware.js";
import { validateEpisode, validatePodcast } from "../../../shared/validate.js";
import upload from "../../auth/middlewares/multer.js";

const router = express.Router();

router.get("/", listPodcasts);

// Episode routes FIRST
router.get("/episodes/:episodeId", getEpisode);

router.put(
  "/episodes/:episodeId",
  authenticate,
  upload.single("audio"),
  validateEpisode,
  updateEpisode,
);

router.delete("/episodes/:episodeId", authenticate, deleteEpisode);

// Podcast routes AFTER
router.get("/:id", getPodcast);

router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  validatePodcast,
  createPodcast,
);

router.put(
  "/:id",
  authenticate,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  validatePodcast,
  updatePodcast,
);

router.delete("/:id", authenticate, deletePodcast);

router.post(
  "/:id/episodes",
  authenticate,
  upload.single("audio"),
  validateEpisode,
  createEpisode,
);

router.get("/:id/episodes", listEpisodes);

export default router;
