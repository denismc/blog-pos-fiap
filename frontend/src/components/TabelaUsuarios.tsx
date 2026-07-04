import type { IUsuario } from '../interfaces/IUsuario';
import type { IUsuarioLogado } from '../interfaces/IUsuarioLogado';

interface TabelaUsuariosProps {
  usuarios: IUsuario[];
  usuarioLogado: IUsuarioLogado;
  onEditar: (id: string) => void;
  onExcluir: (id: string) => void;
}

function TabelaUsuarios({ usuarios, usuarioLogado, onEditar, onExcluir }: TabelaUsuariosProps) {
  const isAdmin = usuarioLogado.perfil === 'Administrador';

  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Perfil</th>
          <th>Criado em</th>
          {isAdmin && <th>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {usuarios.length === 0 ? (
          <tr>
            <td colSpan={isAdmin ? 5 : 4}>Nenhum usuário cadastrado</td>
          </tr>
        ) : (
          usuarios.map((usuario) => (
            <tr key={usuario._id}>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.perfil}</td>
              <td>{new Date(usuario.createdAt).toLocaleDateString('pt-BR')}</td>
              {isAdmin && (
                <td>
                  <button className="btn-editar" onClick={() => onEditar(usuario._id)}>
                    Editar
                  </button>
                  {usuario._id !== usuarioLogado.id && (
                    <button className="btn-excluir" onClick={() => onExcluir(usuario._id)}>
                      Excluir
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default TabelaUsuarios;