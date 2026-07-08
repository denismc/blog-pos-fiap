import { PostController } from '../controllers/postController.js';
import { IPostRepository } from '../repositories/IPostRepository.js';
import { Request, Response } from 'express';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockRepository: jest.Mocked<IPostRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  search: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res) as unknown as Response['status'];
  res.json = jest.fn().mockReturnValue(res) as unknown as Response['json'];
  return res;
};

describe('PostController', () => {
  let controller: PostController;

  beforeEach(() => {
    controller = new PostController(mockRepository);
    jest.clearAllMocks();
  });

  describe('criarPost', () => {
    it('deve usar o id do usuário logado como autor e retornar 201', async () => {
      const postCriado = {
        _id: '10',
        titulo: 'Introdução ao Node.js',
        conteudo: 'Node.js é um runtime JavaScript...',
        autor: '2',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };
      mockRepository.create.mockResolvedValue(postCriado);

      const req = {
        body: { titulo: 'Introdução ao Node.js', conteudo: 'Node.js é um runtime JavaScript...' },
        usuario: { id: '2', perfil: 'Professor' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.criarPost(req, res);

      expect(mockRepository.create).toHaveBeenCalledWith({
        titulo: 'Introdução ao Node.js',
        conteudo: 'Node.js é um runtime JavaScript...',
        autor: '2',
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('deve retornar 400 quando ocorrer erro', async () => {
      mockRepository.create.mockRejectedValue(new Error('Erro ao salvar'));

      const req = {
        body: { titulo: 'Título', conteudo: 'Conteúdo qualquer' },
        usuario: { id: '2', perfil: 'Professor' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.criarPost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Erro ao salvar' });
    });
  });

  describe('listarPosts', () => {
    it('deve retornar lista de posts com status 200', async () => {
      const posts = [
        { _id: '1', titulo: 'A', conteudo: 'B', autor: '2', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];
      mockRepository.findAll.mockResolvedValue(posts);

      const req = {} as Request;
      const res = mockResponse();

      await controller.listarPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(posts);
    });

    it('deve retornar status 500 quando ocorrer erro', async () => {
      mockRepository.findAll.mockRejectedValue(new Error('Erro no banco'));

      const req = {} as Request;
      const res = mockResponse();

      await controller.listarPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Erro no banco' });
    });
  });

  describe('buscarPost', () => {
    it('deve retornar post com status 200 quando encontrado', async () => {
      const post = { _id: '1', titulo: 'A', conteudo: 'B', autor: '2', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
      mockRepository.findById.mockResolvedValue(post);

      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();

      await controller.buscarPost(req, res);

      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(post);
    });

    it('deve retornar status 404 quando post não encontrado', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const req = { params: { id: '999' } } as unknown as Request;
      const res = mockResponse();

      await controller.buscarPost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Post não encontrado' });
    });
  });

  describe('pesquisarPosts', () => {
    it('deve repassar o termo de busca ao repositório e retornar 200', async () => {
      const posts = [
        { _id: '1', titulo: 'Node.js', conteudo: 'B', autor: '2', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];
      mockRepository.search.mockResolvedValue(posts);

      const req = { query: { q: 'node' } } as unknown as Request;
      const res = mockResponse();

      await controller.pesquisarPosts(req, res);

      expect(mockRepository.search).toHaveBeenCalledWith('node');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(posts);
    });

    it('deve buscar com termo vazio quando "q" não é informado', async () => {
      mockRepository.search.mockResolvedValue([]);

      const req = { query: {} } as unknown as Request;
      const res = mockResponse();

      await controller.pesquisarPosts(req, res);

      expect(mockRepository.search).toHaveBeenCalledWith('');
    });
  });

  describe('atualizarPost', () => {
    it('deve retornar 404 quando post não encontrado', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const req = {
        params: { id: '999' },
        body: { titulo: 'Novo título' },
        usuario: { id: '2', perfil: 'Professor' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.atualizarPost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Post não encontrado' });
    });

    it('deve retornar 403 quando o professor não é o autor do post', async () => {
      const postAtual = { _id: '1', titulo: 'A', conteudo: 'B', autor: '2', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
      mockRepository.findById.mockResolvedValue(postAtual);

      const req = {
        params: { id: '1' },
        body: { titulo: 'Novo título' },
        usuario: { id: '3', perfil: 'Professor' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.atualizarPost(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Você só pode alterar seus próprios posts' });
    });

    it('deve retornar 403 mesmo quando o autor vem populado ({ _id, nome })', async () => {
      const postAtual = {
        _id: '1',
        titulo: 'A',
        conteudo: 'B',
        autor: { _id: '2', nome: 'Outro Professor' },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };
      mockRepository.findById.mockResolvedValue(postAtual);

      const req = {
        params: { id: '1' },
        body: { titulo: 'Novo título' },
        usuario: { id: '3', perfil: 'Professor' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.atualizarPost(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve permitir que o próprio autor atualize, mas ignora tentativa de trocar o autor', async () => {
      const postAtual = { _id: '1', titulo: 'A', conteudo: 'B', autor: '2', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
      const postAtualizado = { ...postAtual, titulo: 'Novo título' };
      mockRepository.findById.mockResolvedValue(postAtual);
      mockRepository.update.mockResolvedValue(postAtualizado);

      const req = {
        params: { id: '1' },
        body: { titulo: 'Novo título', autor: '999' },
        usuario: { id: '2', perfil: 'Professor' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.atualizarPost(req, res);

      expect(mockRepository.update).toHaveBeenCalledWith('1', { titulo: 'Novo título', conteudo: undefined });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('deve permitir que o administrador reatribua o autor de qualquer post', async () => {
      const postAtual = { _id: '1', titulo: 'A', conteudo: 'B', autor: '2', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
      mockRepository.findById.mockResolvedValue(postAtual);
      mockRepository.update.mockResolvedValue({ ...postAtual, autor: '999' });

      const req = {
        params: { id: '1' },
        body: { autor: '999' },
        usuario: { id: '1', perfil: 'Administrador' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.atualizarPost(req, res);

      expect(mockRepository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ autor: '999' })
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deletarPost', () => {
    it('deve retornar 404 quando post não encontrado', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const req = {
        params: { id: '999' },
        usuario: { id: '2', perfil: 'Professor' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.deletarPost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Post não encontrado' });
    });

    it('deve retornar 403 quando o professor não é o autor do post', async () => {
      const postAtual = { _id: '1', titulo: 'A', conteudo: 'B', autor: '2', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
      mockRepository.findById.mockResolvedValue(postAtual);

      const req = {
        params: { id: '1' },
        usuario: { id: '3', perfil: 'Professor' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.deletarPost(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Você só pode excluir seus próprios posts' });
    });

    it('deve deletar quando é o próprio autor e retornar 200', async () => {
      const postAtual = { _id: '1', titulo: 'A', conteudo: 'B', autor: '2', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
      mockRepository.findById.mockResolvedValue(postAtual);
      mockRepository.delete.mockResolvedValue(postAtual);

      const req = {
        params: { id: '1' },
        usuario: { id: '2', perfil: 'Professor' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.deletarPost(req, res);

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Post deletado com sucesso' });
    });

    it('deve permitir que o administrador delete post de outro autor', async () => {
      const postAtual = { _id: '1', titulo: 'A', conteudo: 'B', autor: '2', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
      mockRepository.findById.mockResolvedValue(postAtual);
      mockRepository.delete.mockResolvedValue(postAtual);

      const req = {
        params: { id: '1' },
        usuario: { id: '1', perfil: 'Administrador' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.deletarPost(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
