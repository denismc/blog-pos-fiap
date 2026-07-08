import { Types } from 'mongoose';

export interface IPost {
  _id: string | Types.ObjectId;
  titulo: string;
  conteudo: string;
  // Sem populate: string/ObjectId. Com .populate('autor', 'nome'): objeto { _id, nome }.
  autor: string | Types.ObjectId | { _id: string | Types.ObjectId; nome: string };
  createdAt: string | Date;
  updatedAt: string | Date;
}
