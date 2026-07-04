export interface IUsuarioLogado {
  id: string;
  nome: string;
  email: string;
  perfil: 'Administrador' | 'Professor' | 'Aluno';
}