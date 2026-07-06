import { Request, Response } from 'express';
import argon2 from 'argon2';
import { IUsuarioRepository } from '../repositories/IUsuarioRepository.js';
import { env } from '../config/env.js';
import { IAtualizarUsuario } from '../interfaces/IAtualizarUsuario.js';

export class UsuarioController {
  constructor(private repository: IUsuarioRepository) {}

  private async hashSenha(senha: string): Promise<string> {
    return await argon2.hash(senha + env.PEPPER, {
      type: argon2.argon2id,
    });
  }

  async criarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, senha, perfil } = req.body;

      const senhaHash = await this.hashSenha(senha);
      const usuario = await this.repository.create({
        nome,
        email,
        senha: senhaHash,
        perfil,
      });

      const { senha: _, ...usuarioSemSenha } = usuario as typeof usuario & { senha?: string };
      res.status(201).json(usuarioSemSenha);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(400).json({ erro: message });
    }
  }

  async listarUsuarios(_req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await this.repository.findAll();
      res.status(200).json(usuarios);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(500).json({ erro: message });
    }
  }

  async buscarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuario = await this.repository.findById(req.params.id as string);
      if (!usuario) {
        res.status(404).json({ erro: 'Usuário não encontrado' });
        return;
      }
      res.status(200).json(usuario);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(500).json({ erro: message });
    }
  }

  async atualizarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, senha, perfil } = req.body;
      const dados: IAtualizarUsuario = { nome, email, perfil };

      const usuarioAtual = await this.repository.findById(req.params.id as string);
      if (!usuarioAtual) {
        res.status(404).json({ erro: 'Usuário não encontrado' });
        return;
      }

      const eOMesmoUsuario = req.usuario?.id === req.params.id;
      if (eOMesmoUsuario && perfil !== usuarioAtual.perfil) {
        res.status(403).json({ erro: 'Você não pode alterar seu próprio perfil' });
        return;
      }

      if (senha) dados.senha = await this.hashSenha(senha);

      const usuario = await this.repository.update(req.params.id as string, dados);
      res.status(200).json(usuario);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(400).json({ erro: message });
    }
  }

  async deletarUsuario(req: Request, res: Response): Promise<void> {
    try {
      if (req.usuario?.id === req.params.id) {
        res.status(403).json({ erro: 'Você não pode excluir sua própria conta' });
        return;
      }

      const usuario = await this.repository.delete(req.params.id as string);
      if (!usuario) {
        res.status(404).json({ erro: 'Usuário não encontrado' });
        return;
      }
      res.status(200).json({ mensagem: 'Usuário deletado com sucesso' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(500).json({ erro: message });
    }
  }
}