import { IPostRepository } from './IPostRepository.js';
import { IPost } from '../interfaces/IPost.js';
import { ICriarPost } from '../interfaces/ICriarPost.js';
import { IAtualizarPost } from '../interfaces/IAtualizarPost.js';
import Post from '../models/postModel.js';

const escaparRegex = (texto: string): string => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class PostRepository implements IPostRepository {
  async findAll(): Promise<IPost[]> {
    return await Post.find().populate('autor', 'nome').sort({ createdAt: -1 }).lean();
  }

  async findById(id: string): Promise<IPost | null> {
    return await Post.findById(id).populate('autor', 'nome').lean();
  }

  async search(termo: string): Promise<IPost[]> {
    const regex = new RegExp(escaparRegex(termo), 'i');
    return await Post.find({ $or: [{ titulo: regex }, { conteudo: regex }] })
      .populate('autor', 'nome')
      .sort({ createdAt: -1 })
      .lean();
  }

  async create(dados: ICriarPost): Promise<IPost> {
    const post = new Post(dados);
    await post.save();
    return post.toObject();
  }

  async update(id: string, dados: IAtualizarPost): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(id, dados, { new: true, runValidators: true })
      .populate('autor', 'nome')
      .lean();
  }

  async delete(id: string): Promise<IPost | null> {
    return await Post.findByIdAndDelete(id).lean();
  }
}
