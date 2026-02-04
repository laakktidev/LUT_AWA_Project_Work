import mongoose, { Schema, Document } from "mongoose";

/* -----------------------------
   1. TypeScript Interfaces
------------------------------*/

export interface ISlide {
  header: string;
  bullets: string[];   // ← list of bullet items
}

export interface ISlideDeck extends Document {
  title: string;
  slides: ISlide[];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

/* -----------------------------
   2. Mongoose Schemas
------------------------------*/

const SlideSchema = new Schema<ISlide>({
  header: {
    type: String,
    required: true,
  },
  bullets: {
    type: [String],   // ← array of strings
    default: [],
  },
});

const SlideDeckSchema = new Schema<ISlideDeck>(
  {
    title: {
      type: String,
      required: true,
    },
    slides: {
      type: [SlideSchema],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }   // ⭐ enables createdAt + updatedAt automatically
);


/* -----------------------------
   3. Export Model
------------------------------*/

export const SlideDeck = mongoose.model<ISlideDeck>(
  "SlideDeck",
  SlideDeckSchema
);
