import mongoose, { Schema, Document } from "mongoose";

/* -----------------------------
   1. TypeScript Interfaces
------------------------------*/

export interface ISlide {
  title: string;
  bullets: string[];
}

export interface IPresentation extends Document {
  title: string;
  type: "presentation";
  slides: ISlide[];

  userId: string;
  editors: string[];   // ⭐ For sharing

  lock: {
    isLocked: boolean;
    lockedBy: string | null;
    lockedAt: Date | null;
  };

  createdAt: Date;
  updatedAt: Date;
}

/* -----------------------------
   2. Mongoose Schemas
------------------------------*/

const SlideSchema = new Schema<ISlide>({
  title: { type: String, required: true },
  bullets: { type: [String], default: [] },
});

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
}
,

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

/* -----------------------------
   3. Export Model
------------------------------*/

export const Presentation = mongoose.model<IPresentation>(
  "Presentation",
  PresentationSchema
);
