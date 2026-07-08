import { IPost } from '../interfaces/IPost.js';
import { ICriarPost } from '../interfaces/ICriarPost.js';
import { IAtualizarPost } from '../interfaces/IAtualizarPost.js';

export interface IPostRepository {
  findAll(): Promise<IPost[]>;
  findById(id: string): Promise<IPost | null>;
  search(termo: string): Promise<IPost[]>;
  create(dados: ICriarPost): Promise<IPost>;
  update(id: string, dados: IAtualizarPost): Promise<IPost | null>;
  delete(id: string): Promise<IPost | null>;
}
