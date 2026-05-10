import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config({ path: ".env" }); // Try root first
if (!process.env.MONGO_URI) {
  dotenv.config({ path: "../.env" }); // Then try parent if run from scratch/
}

async function addTestUser() {
  const email = "adityakumarrjhaa@gmail.com";
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists. Updating type to hotelier...");
      existingUser.type = "hotelier";
      await existingUser.save();
      console.log("User updated successfully.");
    } else {
      console.log("Creating new test user...");
      await User.create({
        username: "Aditya Kumar Jha",
        email: email,
        password: "password123", // placeholder
        type: "hotelier", // So they get hotelier alerts too
      });
      console.log("Test user created successfully.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

addTestUser();
