import { Types } from 'mongoose';

export interface IUsuario {
  _id: string | Types.ObjectId;
  nome: string;
  email: string;
  perfil: 'Administrador' | 'Professor' | 'Aluno';
  senha?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}