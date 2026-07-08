import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const criarPostSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(150),
  conteudo: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
});

export const atualizarPostSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(150).optional(),
  conteudo: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres').optional(),
  autor: z.string().regex(objectIdRegex, 'Id de autor inválido').optional(),
});
