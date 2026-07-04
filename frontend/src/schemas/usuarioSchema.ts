import { z } from 'zod';

export const criarUsuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(20),
  perfil: z.enum(['Administrador', 'Professor', 'Aluno'] as const, {
    error: 'Perfil inválido',
  }),
});

export const atualizarUsuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(20).optional().or(z.literal('')),
  perfil: z.enum(['Administrador', 'Professor', 'Aluno'] as const, {
    error: 'Perfil inválido',
  }),
});

export type CriarUsuarioForm = z.infer<typeof criarUsuarioSchema>;
export type AtualizarUsuarioForm = z.infer<typeof atualizarUsuarioSchema>;