import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Episode = sequelize.define(
  "Episode",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    audioUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    podcastId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "episodes",
    timestamps: true,
  },
);

export default Episode;
