import { useMemo } from 'react';
import type { IPost } from '../interfaces/IPost';

interface CardsPostsProps {
  posts: IPost[];
  termoBusca: string;
  onTermoBuscaChange: (valor: string) => void;
  onAbrirDetalhe: (post: IPost) => void;
}

const TAMANHO_RESUMO = 140;

function CardsPosts({ posts, termoBusca, onTermoBuscaChange, onAbrirDetalhe }: CardsPostsProps) {
  const postsFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase();
    if (!termo) return posts;
    return posts.filter(
      (post) =>
        post.titulo.toLowerCase().includes(termo) ||
        post.conteudo.toLowerCase().includes(termo) ||
        post.autor.nome.toLowerCase().includes(termo)
    );
  }, [posts, termoBusca]);

  return (
    <div>
      <input
        type="text"
        className="busca-cards"
        placeholder="Buscar por título, conteúdo ou professor..."
        value={termoBusca}
        onChange={(e) => onTermoBuscaChange(e.target.value)}
      />

      {postsFiltrados.length === 0 ? (
        <p className="sem-posts">Nenhum post encontrado.</p>
      ) : (
        <div className="grade-posts">
          {postsFiltrados.map((post) => (
            <div key={post._id} className="post-card" onClick={() => onAbrirDetalhe(post)}>
              <h3 className="post-card-titulo">{post.titulo}</h3>
              <p className="post-card-resumo">
                {post.conteudo.length > TAMANHO_RESUMO
                  ? `${post.conteudo.slice(0, TAMANHO_RESUMO)}…`
                  : post.conteudo}
              </p>
              <div className="post-card-rodape">
                <span className="post-card-autor">{post.autor.nome}</span>
                <span className="post-card-data">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardsPosts;
