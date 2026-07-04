export interface IUsuario {
  _id: string;
  nome: string;
  email: string;
  perfil: 'Administrador' | 'Professor' | 'Aluno';
  createdAt: string;
  updatedAt: string;
}