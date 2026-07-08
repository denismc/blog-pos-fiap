import type { IPost } from '../interfaces/IPost';
import type { IUsuarioLogado } from '../interfaces/IUsuarioLogado';

interface TabelaPostsProps {
  posts: IPost[];
  usuarioLogado: IUsuarioLogado;
  termoBusca: string;
  onTermoBuscaChange: (valor: string) => void;
  onBuscar: (e: React.FormEvent) => void;
  onAbrirDetalhe: (post: IPost) => void;
  onEditar: (post: IPost) => void;
  onExcluir: (id: string) => void;
}

function TabelaPosts({
  posts,
  usuarioLogado,
  termoBusca,
  onTermoBuscaChange,
  onBuscar,
  onAbrirDetalhe,
  onEditar,
  onExcluir,
}: TabelaPostsProps) {
  const podeGerenciar = (post: IPost) =>
    usuarioLogado.perfil === 'Administrador' ||
    (usuarioLogado.perfil === 'Professor' && post.autor._id === usuarioLogado.id);

  return (
    <div>
      <form className="busca-posts" onSubmit={onBuscar}>
        <input
          type="text"
          placeholder="Buscar por título ou conteúdo..."
          value={termoBusca}
          onChange={(e) => onTermoBuscaChange(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      <table className="tabela">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Publicado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan={4}>Nenhum post encontrado</td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post._id}>
                <td className="post-titulo" onClick={() => onAbrirDetalhe(post)}>
                  {post.titulo}
                </td>
                <td>{post.autor.nome}</td>
                <td>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  {podeGerenciar(post) && (
                    <>
                      <button className="btn-editar" onClick={() => onEditar(post)}>
                        Editar
                      </button>
                      <button className="btn-excluir" onClick={() => onExcluir(post._id)}>
                        Excluir
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaPosts;
