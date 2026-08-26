import { User } from "../modules/index.js";
import bcrypt from "bcryptjs";

const run = async () => {
  try {
    const existing = await User.findOne({
      where: { email: "demo@example.com" },
    });
    if (!existing) {
      await User.create({
        name: "Demo User",
        email: "demo@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "admin",
      });
    }
    console.log("Seed data completed");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
