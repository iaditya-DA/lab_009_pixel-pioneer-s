import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
  streamId: mongoose.Types.ObjectId;
  user: string;
  text: string;
  timestamp: Date;
}

const CommentSchema: Schema = new Schema({
  streamId: { type: Schema.Types.ObjectId, ref: 'Stream', required: true },
  user: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;