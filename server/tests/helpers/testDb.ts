import mongoose from "mongoose";

export async function connectTestDb() {
  await mongoose.connect("mongodb://127.0.0.1:27017/myapp_test");
}

export async function disconnectTestDb() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}
