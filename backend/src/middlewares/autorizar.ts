import { Request, Response, NextFunction } from 'express';

export const autorizar =
  (...perfis: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const usuario = req.usuario;

    if (!usuario || !perfis.includes(usuario.perfil as string)) {
      res.status(403).json({ erro: 'Acesso negado' });
      return;
    }

    next();
  };