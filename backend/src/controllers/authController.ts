import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { IUsuarioRepository } from '../repositories/IUsuarioRepository.js';
import { env } from '../config/env.js';

export class AuthController {
  constructor(private repository: IUsuarioRepository) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha } = req.body as { email: string; senha: string };

      const usuario = await this.repository.findByEmail(email);
      if (!usuario) {
        res.status(401).json({ erro: 'Credenciais inválidas' });
        return;
      }

      const senhaValida = await argon2.verify(usuario.senha, senha + env.PEPPER);
      if (!senhaValida) {
        res.status(401).json({ erro: 'Credenciais inválidas' });
        return;
      }

      const token = jwt.sign(
        { id: usuario._id, perfil: usuario.perfil },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
      );

      res.status(200).json({
        token,
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(500).json({ erro: message });
    }
  }
}