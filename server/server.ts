import app from "./src/app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const port = parseInt(process.env.PORT as string) || 1234;
const MONGO_URL = "mongodb://127.0.0.1:27017/testdb";

mongoose.connect(MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB:", mongoose.connection.name);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
