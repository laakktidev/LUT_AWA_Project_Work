import mongoose, { Document, Schema } from "mongoose";

/**
 * Represents a user account stored in MongoDB.
 *
 * @remarks
 * This model contains:
 * - authentication fields (`email`, `password`)
 * - profile information (`username`, `profilePicture`)
 *
 * Passwords are stored as hashed strings (handled in the service layer).
 * The model does not include any business logic — it is a pure data schema.
 */
interface IUser extends Document {
  /** User's unique email address. */
  email: string;

  /** Hashed password string. */
  password: string;

  /** Public username displayed in the UI. */
  username: string;

  /** Path to the user's profile picture, or null if not set. */
  profilePicture: string;
}

/**
 * Mongoose schema defining the structure of a user document.
 *
 * @remarks
 * Includes:
 * - unique email constraint
 * - required fields
 * - optional profile picture
 */
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  profilePicture: { type: String, default: null }
});

/**
 * Mongoose model for users.
 */
const UserModel: mongoose.Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export { UserModel as User, IUser };