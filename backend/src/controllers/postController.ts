import { Request, Response } from 'express';
import { IPostRepository } from '../repositories/IPostRepository.js';
import { IPost } from '../interfaces/IPost.js';
import { IAtualizarPost } from '../interfaces/IAtualizarPost.js';

export class PostController {
  constructor(private repository: IPostRepository) {}

  private obterIdAutor(autor: IPost['autor']): string {
    if (typeof autor === 'object' && '_id' in autor) return String(autor._id);
    return String(autor);
  }

  async criarPost(req: Request, res: Response): Promise<void> {
    try {
      const { titulo, conteudo } = req.body;
      const autor = req.usuario?.id as string;
      const post = await this.repository.create({ titulo, conteudo, autor });
      res.status(201).json(post);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(400).json({ erro: message });
    }
  }

  async listarPosts(_req: Request, res: Response): Promise<void> {
    try {
      const posts = await this.repository.findAll();
      res.status(200).json(posts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(500).json({ erro: message });
    }
  }

  async buscarPost(req: Request, res: Response): Promise<void> {
    try {
      const post = await this.repository.findById(req.params.id as string);
      if (!post) {
        res.status(404).json({ erro: 'Post não encontrado' });
        return;
      }
      res.status(200).json(post);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(500).json({ erro: message });
    }
  }

  async pesquisarPosts(req: Request, res: Response): Promise<void> {
    try {
      const termo = typeof req.query.q === 'string' ? req.query.q : '';
      const posts = await this.repository.search(termo);
      res.status(200).json(posts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(500).json({ erro: message });
    }
  }

  async atualizarPost(req: Request, res: Response): Promise<void> {
    try {
      const { titulo, conteudo, autor } = req.body;

      const postAtual = await this.repository.findById(req.params.id as string);
      if (!postAtual) {
        res.status(404).json({ erro: 'Post não encontrado' });
        return;
      }

      const ehAdministrador = req.usuario?.perfil === 'Administrador';
      const ehAutor = req.usuario?.id === this.obterIdAutor(postAtual.autor);
      if (!ehAdministrador && !ehAutor) {
        res.status(403).json({ erro: 'Você só pode alterar seus próprios posts' });
        return;
      }

      const dados: IAtualizarPost = { titulo, conteudo };
      if (ehAdministrador && autor) dados.autor = autor;

      const post = await this.repository.update(req.params.id as string, dados);
      res.status(200).json(post);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(400).json({ erro: message });
    }
  }

  async deletarPost(req: Request, res: Response): Promise<void> {
    try {
      const postAtual = await this.repository.findById(req.params.id as string);
      if (!postAtual) {
        res.status(404).json({ erro: 'Post não encontrado' });
        return;
      }

      const ehAdministrador = req.usuario?.perfil === 'Administrador';
      const ehAutor = req.usuario?.id === this.obterIdAutor(postAtual.autor);
      if (!ehAdministrador && !ehAutor) {
        res.status(403).json({ erro: 'Você só pode excluir seus próprios posts' });
        return;
      }

      await this.repository.delete(req.params.id as string);
      res.status(200).json({ mensagem: 'Post deletado com sucesso' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(500).json({ erro: message });
    }
  }
}
