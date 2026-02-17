import mongoose, { Schema, Document } from "mongoose";

/**
 * Represents a user‑created document or presentation stored in MongoDB.
 *
 * @remarks
 * This model supports:
 * - ownership and shared editing (`userId`, `editors`)
 * - document vs. presentation types
 * - soft deletion (`isDeleted`, `deletedAt`)
 * - public visibility (`isPublic`)
 * - collaborative locking (`lock`)
 * - automatic timestamps (`createdAt`, `updatedAt`)
 *
 * It is used throughout the application for:
 * - document editing
 * - presentation editing
 * - sharing and permissions
 * - trash management
 * - public viewing
 */
interface IDocument extends Document {
  /** Owner of the document. */
  userId: mongoose.Types.ObjectId;

  /** Users who have edit permissions. */
  editors: mongoose.Types.ObjectId[];

  /** Title of the document or presentation. */
  title: string;

  /** Rich‑text or HTML content. */
  content: string;

  /** Distinguishes between standard documents and presentations. */
  type: "presentation" | "document";

  /** Timestamp when the document was created. */
  createdAt: Date;

  /** Timestamp when the document was last updated. */
  updatedAt: Date;

  /** Whether the document is publicly accessible. */
  isPublic: boolean;

  /** Whether the document has been soft‑deleted. */
  isDeleted: boolean;

  /** Timestamp when the document was soft‑deleted, if applicable. */
  deletedAt: Date | null;

  /** Lock state for collaborative editing. */
  lock: {
    /** Whether the document is currently locked. */
    isLocked: boolean;

    /** User who holds the lock, or null if unlocked. */
    lockedBy: mongoose.Types.ObjectId | null;
  };
}

/**
 * Mongoose schema defining the structure of a document or presentation.
 *
 * @remarks
 * Includes:
 * - references to users
 * - default values
 * - enum validation
 * - timestamps enabled
 */
const DocumentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    editors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      enum: ["presentation", "document"],
      default: "document",
    },

    lock: {
      isLocked: { type: Boolean, default: false },
      lockedBy: { type: Schema.Types.ObjectId, ref: "User", default: null }
    },

    isPublic: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },

  { timestamps: true }
);

/**
 * Mongoose model for documents and presentations.
 */
const DocumentModel: mongoose.Model<IDocument> =
  mongoose.model<IDocument>("Document", DocumentSchema);

export { DocumentModel as Document, IDocument };