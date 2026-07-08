import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    conteudo: { type: String, required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
