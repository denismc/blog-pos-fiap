export interface IPostAutor {
  _id: string;
  nome: string;
}

export interface IPost {
  _id: string;
  titulo: string;
  conteudo: string;
  autor: IPostAutor;
  createdAt: string;
  updatedAt: string;
}
