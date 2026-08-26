import { Podcast, Episode, User } from "../index.js";
import { Op } from "sequelize";
import { buildPagination, slugify } from "../../shared/utils.js";

export const podcastService = {
  async list(query) {
    const { page, limit, offset } = buildPagination(query.page, query.limit);
    const where = {};

    if (query.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${query.search}%` } },
        { description: { [Op.iLike]: `%${query.search}%` } },
      ];
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.published !== undefined) {
      where.isPublished = query.published === "true";
    }

    const { rows, count } = await Podcast.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email", "avatarUrl"],
        },
      ],
      order: [[query.sortBy || "createdAt", query.sortOrder || "DESC"]],
    });

    return { rows, count, page, limit };
  },

  async getById(id) {
    return Podcast.findByPk(id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email", "avatarUrl"],
        },
        { model: Episode, as: "episodes" },
      ],
    });
  },

  async create(payload, userId) {
    const slug = slugify(payload.title);

    return Podcast.create({
      ...payload,
      slug,
      createdBy: userId,
    });
  },

  async update(id, payload, userId) {
    const podcast = await Podcast.findOne({ where: { id, createdBy: userId } });
    if (!podcast)
      throw Object.assign(new Error("Podcast not found"), { statusCode: 404 });
    await podcast.update(payload);
    return podcast;
  },

  async remove(id, userId) {
    const podcast = await Podcast.findOne({ where: { id, createdBy: userId } });
    if (!podcast)
      throw Object.assign(new Error("Podcast not found"), { statusCode: 404 });
    await podcast.destroy();
    return { success: true };
  },

  async addEpisode(podcastId, payload, userId) {
    const podcast = await Podcast.findOne({
      where: { id: podcastId, createdBy: userId },
    });
    if (!podcast)
      throw Object.assign(new Error("Podcast not found"), { statusCode: 404 });
    return Episode.create({ ...payload, podcastId });
  },

  async listEpisodes(podcastId) {
    return Episode.findAll({ where: { podcastId } });
  },
  async updateEpisode(episodeId, payload, userId) {
  const episode = await Episode.findByPk(episodeId, {
    include: [
      {
        model: Podcast,
        as: "podcast",
      },
    ],
  });

  if (!episode) {
    throw new Error("Episode not found");
  }

  if (episode.podcast.createdBy !== userId) {
    throw new Error("Unauthorized");
  }

  await episode.update(payload);

  return episode;
},

async deleteEpisode(episodeId, userId) {
  const episode = await Episode.findByPk(episodeId, {
    include: [
      {
        model: Podcast,
        as: "podcast",
      },
    ],
  });

  if (!episode) {
    throw new Error("Episode not found");
  }

  if (episode.podcast.createdBy !== userId) {
    throw new Error("Unauthorized");
  }

  await episode.destroy();

  return {
    message: "Episode deleted successfully",
  };
},
async getEpisodeById(episodeId) {
  return await Episode.findByPk(episodeId, {
    include: [
      {
        model: Podcast,
        as: "podcast",
        attributes: [
          "id",
          "title",
          "createdBy",
        ],
      },
    ],
  });
}
};
