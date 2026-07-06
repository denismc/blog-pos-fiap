export interface ICriarUsuario {
  nome: string;
  email: string;
  senha: string;
  perfil: 'Administrador' | 'Professor' | 'Aluno';
}