import mongoose, { Schema, Document } from "mongoose";

/* =======================================================
   1. TypeScript Interfaces
   ------------------------------------------------------- */
/**
 * Represents a single slide within a presentation.
 *
 * @remarks
 * Each slide contains:
 * - a title
 * - an array of bullet points
 *
 * This structure is intentionally simple to keep presentations lightweight
 * and easy to render on the frontend.
 */
export interface ISlide {
  title: string;
  bullets: string[];
}

/**
 * Represents a full presentation document stored in MongoDB.
 *
 * @remarks
 * This model supports:
 * - multiple slides
 * - ownership and shared editing (`userId`, `editors`)
 * - collaborative locking (`lock`)
 * - automatic timestamps (`createdAt`, `updatedAt`)
 *
 * Unlike standard documents, presentations always have `type: "presentation"`.
 */
export interface IPresentation extends Document {
  /** Title of the presentation. */
  title: string;

  /** Always `"presentation"` for this model. */
  type: "presentation";

  /** Array of slides that make up the presentation. */
  slides: ISlide[];

  /** ID of the user who owns the presentation. */
  userId: string;

  /** IDs of users who have edit permissions. */
  editors: string[];

  /** Lock state for collaborative editing. */
  lock: {
    /** Whether the presentation is currently locked. */
    isLocked: boolean;

    /** User ID of the lock holder, or null if unlocked. */
    lockedBy: string | null;

    /** Timestamp when the lock was applied. */
    lockedAt: Date | null;
  };

  /** Timestamp when the presentation was created. */
  createdAt: Date;

  /** Timestamp when the presentation was last updated. */
  updatedAt: Date;
}

/* =======================================================
   2. Mongoose Schemas
   ------------------------------------------------------- */

/**
 * Schema for individual slides inside a presentation.
 */
const SlideSchema = new Schema<ISlide>({
  title: { type: String, required: true },
  bullets: { type: [String], default: [] },
});

/**
 * Schema for the presentation model.
 *
 * @remarks
 * Includes:
 * - embedded slides
 * - user ownership
 * - editor permissions
 * - lock metadata
 * - timestamps
 */
const PresentationSchema = new Schema<IPresentation>(
  {
    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["presentation"],
      default: "presentation",
    },

    slides: {
      type: [SlideSchema],
      default: [],
    },

    userId: {
      type: String,
      required: true,
    },

    editors: {
      type: [String],
      ref: "User",
      default: [],
    },

    lock: {
      isLocked: { type: Boolean, default: false },
      lockedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
      lockedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

/* =======================================================
   3. Export Model
   ------------------------------------------------------- */
/**
 * Mongoose model for presentations.
 */
export const Presentation = mongoose.model<IPresentation>(
  "Presentation",
  PresentationSchema
);
