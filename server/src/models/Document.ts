import mongoose, { Schema, Document } from "mongoose";

interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;
  editors: mongoose.Types.ObjectId[];
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
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
    },
    isPublic: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

  },
  
  { timestamps: true }
);

const DocumentModel: mongoose.Model<IDocument> =
  mongoose.model<IDocument>("Document", DocumentSchema);

export { DocumentModel as Document, IDocument };
