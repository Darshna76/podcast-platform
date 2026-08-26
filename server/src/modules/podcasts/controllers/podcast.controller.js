import { podcastService } from "../podcast.service.js";

export const listPodcasts = async (req, res, next) => {
  try {
    const result = await podcastService.list(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getPodcast = async (req, res, next) => {
  try {
    const podcast = await podcastService.getById(req.params.id);
    if (!podcast) return res.status(404).json({ message: "Podcast not found" });
    res.json(podcast);
  } catch (error) {
    next(error);
  }
};

export const createPodcast = async (req, res, next) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,

      thumbnailUrl: req.files?.thumbnail?.[0]
        ? `/uploads/avatars/${req.files.thumbnail[0].filename}`
        : null,

      bannerUrl: req.files?.banner?.[0]
        ? `/uploads/avatars/${req.files.banner[0].filename}`
        : null,

      isPublished: req.body.isPublished === "true",
    };

    const podcast = await podcastService.create(payload, req.user.id);

    res.status(201).json(podcast);
  } catch (error) {
    next(error);
  }
};

export const updatePodcast = async (req, res, next) => {
  try {
    const existingPodcast = await podcastService.getById(req.params.id);

    if (!existingPodcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    const payload = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      isPublished: req.body.isPublished === "true",

      thumbnailUrl: req.files?.thumbnail?.[0]
        ? `/uploads/avatars/${req.files.thumbnail[0].filename}`
        : existingPodcast.thumbnailUrl,

      bannerUrl: req.files?.banner?.[0]
        ? `/uploads/avatars/${req.files.banner[0].filename}`
        : existingPodcast.bannerUrl,
    };

    const podcast = await podcastService.update(
      req.params.id,
      payload,
      req.user.id
    );

    res.json(podcast);
  } catch (error) {
    next(error);
  }
};

export const deletePodcast = async (req, res, next) => {
  try {
    const result = await podcastService.remove(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createEpisode = async (req, res, next) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      audioUrl: req.file?.filename
        ? `/uploads/avatars/${req.file.filename}`
        : req.body.audioUrl,
      duration: req.body.duration || null,
    };

    const episode = await podcastService.addEpisode(
      req.params.id,
      payload,
      req.user.id,
    );
    res.status(201).json(episode);
  } catch (error) {
    next(error);
  }
};
export const updateEpisode = async (req, res, next) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration || null,
      audioUrl: req.file?.filename
        ? `/uploads/avatars/${req.file.filename}`
        : req.body.audioUrl,
    };

    const episode = await podcastService.updateEpisode(
      req.params.episodeId,
      payload,
      req.user.id
    );

    res.json(episode);
  } catch (error) {
    next(error);
  }
};

export const deleteEpisode = async (req, res, next) => {
  try {
    const result = await podcastService.deleteEpisode(
      req.params.episodeId,
      req.user.id
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const listEpisodes = async (req, res, next) => {
  try {
    const episodes = await podcastService.listEpisodes(req.params.id);
    res.json(episodes);
  } catch (error) {
    next(error);
  }
};
export const getEpisode = async (req, res, next) => {
  try {
    const episode = await podcastService.getEpisodeById(
      req.params.episodeId
    );

    if (!episode) {
      return res.status(404).json({
        message: "Episode not found",
      });
    }

    res.json(episode);
  } catch (error) {
    next(error);
  }
};
