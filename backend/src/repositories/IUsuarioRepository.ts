import { IUsuario } from '../interfaces/IUsuario.js';
import { ICriarUsuario } from '../interfaces/ICriarUsuario.js';
import { IAtualizarUsuario } from '../interfaces/IAtualizarUsuario.js';

export interface IUsuarioRepository {
  findAll(): Promise<IUsuario[]>;
  findById(id: string): Promise<IUsuario | null>;
  findByEmail(email: string): Promise<(IUsuario & { senha: string }) | null>;
  create(dados: ICriarUsuario): Promise<IUsuario>;
  update(id: string, dados: Partial<IUsuario>): Promise<IUsuario | null>;
  delete(id: string): Promise<IUsuario | null>;
}