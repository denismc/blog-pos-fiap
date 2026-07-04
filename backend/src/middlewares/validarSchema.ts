import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validarSchema =
  (schema: z.ZodObject<z.ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        erro: 'Dados inválidos',
        detalhes: result.error.issues.map((issue) => ({
          campo: issue.path.join('.'),
          mensagem: issue.message,
        })),
      });
      return;
    }

    req.body = result.data;
    next();
  };