import sequelize from "../config/database.js";
import "../modules/index.js";

const run = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
