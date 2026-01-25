import { User } from "../models/User";

export async function updateUserProfilePicture(userId: string, filePath: string) {
  return User.findByIdAndUpdate(userId, {
    profilePicture: filePath
  });
}
