import { z } from 'zod';

export const criarPostSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(150),
  conteudo: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
});

export const atualizarPostSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(150),
  conteudo: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
});

export type CriarPostForm = z.infer<typeof criarPostSchema>;
export type AtualizarPostForm = z.infer<typeof atualizarPostSchema>;
