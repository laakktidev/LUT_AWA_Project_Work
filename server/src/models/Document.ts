import mongoose, { Schema, Document } from "mongoose";

interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;           // owner
  editors: mongoose.Types.ObjectId[];        // users with edit rights
  viewToken: string | null;                  // link-based read-only access
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  lock: {
    isLocked: boolean;
    lockedBy: mongoose.Types.ObjectId | null;
  };
}

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
    viewToken: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      default: ""
    },
    lock: {
      isLocked: { type: Boolean, default: false },
      lockedBy: { type: Schema.Types.ObjectId, ref: "User", default: null }
    }
  },
  { timestamps: true }
);

const DocumentModel: mongoose.Model<IDocument> =
  mongoose.model<IDocument>("Document", DocumentSchema);

export { DocumentModel as Document, IDocument };
