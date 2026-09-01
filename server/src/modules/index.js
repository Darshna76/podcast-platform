import User from "./users/user.model.js";
import Podcast from "./podcasts/podcast.model.js";
import Episode from "./podcasts/episode.model.js";
import { RefreshToken, PasswordResetToken } from "./auth/auth.model.js";

User.hasMany(Podcast, { foreignKey: "createdBy", as: "podcasts" });
Podcast.belongsTo(User, { foreignKey: "createdBy", as: "author" });
Podcast.hasMany(Episode, { foreignKey: "podcastId", as: "episodes" });
Episode.belongsTo(Podcast, { foreignKey: "podcastId", as: "podcast" });
User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(PasswordResetToken, {
  foreignKey: "userId",
  as: "passwordResetTokens",
});
PasswordResetToken.belongsTo(User, { foreignKey: "userId", as: "user" });

export { User, Podcast, Episode, RefreshToken, PasswordResetToken };
