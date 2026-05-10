import mongoose from "mongoose";

async function dbConnect() {
    const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error("Please add your MONGODB URI to .env.local")
    }
    return mongoose.connect(MONGODB_URI);
}
export default dbConnect;