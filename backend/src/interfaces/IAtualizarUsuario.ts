export interface IAtualizarUsuario {
  nome?: string;
  email?: string;
  senha?: string;
  perfil?: 'Administrador' | 'Professor' | 'Aluno';
}