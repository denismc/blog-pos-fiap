import { useState, useEffect } from 'react';
import api from '../services/api';
import CardsPosts from '../components/CardsPosts';
import Modal from '../components/Modal';
import PostDetalhe from '../components/PostDetalhe';
import type { IPost } from '../interfaces/IPost';

function TelaPostsAluno() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [postSelecionado, setPostSelecionado] = useState<IPost | null>(null);

  useEffect(() => {
    const carregarPosts = async () => {
      const res = await api.get<IPost[]>('/posts');
      setPosts(res.data);
    };
    carregarPosts();
  }, []);

  return (
    <div>
      <CardsPosts
        posts={posts}
        termoBusca={termoBusca}
        onTermoBuscaChange={setTermoBusca}
        onAbrirDetalhe={setPostSelecionado}
      />

      {postSelecionado && (
        <Modal titulo={postSelecionado.titulo} onFechar={() => setPostSelecionado(null)} grande>
          <PostDetalhe post={postSelecionado} />
        </Modal>
      )}
    </div>
  );
}

export default TelaPostsAluno;
