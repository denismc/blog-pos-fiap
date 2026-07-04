import { Request, Response } from 'express';
import argon2 from 'argon2';
import Usuario from '../models/usuarioModel.js';
import { env } from '../config/env.js';

interface DadosUsuario {
  nome: string;
  email: string;
  perfil: string;
  senha?: string;
}

const hashSenha = async (senha: string): Promise<string> => {
  return await argon2.hash(senha + env.PEPPER, {
    type: argon2.argon2id,
  });
};

export const criarUsuario = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nome, email, senha, perfil } = req.body as DadosUsuario;

    if (!senha) {
      res.status(400).json({ erro: 'Senha é obrigatória' });
      return;
    }

    const senhaHash = await hashSenha(senha);
    const usuario = new Usuario({ nome, email, senha: senhaHash, perfil });
    await usuario.save();

    const usuarioResposta = usuario.toObject() as Partial<typeof usuario> & {
      senha?: string;
    };
    delete usuarioResposta.senha;

    res.status(201).json(usuarioResposta);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    res.status(400).json({ erro: message });
  }
};

export const listarUsuarios = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    res.status(500).json({ erro: message });
  }
};

export const buscarUsuario = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
      return;
    }
    res.status(200).json(usuario);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    res.status(500).json({ erro: message });
  }
};

export const atualizarUsuario = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nome, email, senha, perfil } = req.body as DadosUsuario;
    const dados: DadosUsuario = { nome, email, perfil };

    const usuarioAtual = await Usuario.findById(req.params.id);
    if (!usuarioAtual) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
      return;
    }

    const eOMesmoUsuario = req.usuario?.id === req.params.id;
    if (eOMesmoUsuario && perfil !== usuarioAtual.perfil) {
      res.status(403).json({ erro: 'Você não pode alterar seu próprio perfil' });
      return;
    }

    if (senha) dados.senha = await hashSenha(senha);

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, dados, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(usuario);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    res.status(400).json({ erro: message });
  }
};

export const deletarUsuario = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.usuario?.id === req.params.id) {
      res.status(403).json({ erro: 'Você não pode excluir sua própria conta' });
      return;
    }

    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
      return;
    }
    res.status(200).json({ mensagem: 'Usuário deletado com sucesso' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    res.status(500).json({ erro: message });
  }
};