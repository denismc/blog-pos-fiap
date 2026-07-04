import { useState, useEffect } from 'react';
import api from './services/api';
import Header from './components/Header';
import TabelaUsuarios from './components/TabelaUsuarios';
import Modal from './components/Modal';
import FormUsuario from './components/FormUsuario';
import Login from './components/Login';
import './App.css';
import type { CriarUsuarioForm, AtualizarUsuarioForm } from './schemas/usuarioSchema';
import type { IUsuario } from './interfaces/IUsuario';
import type { IUsuarioLogado } from './interfaces/IUsuarioLogado';
import type { IAxiosError } from './interfaces/IAxiosError';

function App() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<IUsuario | null>(null);

  const [usuarioLogado, setUsuarioLogado] = useState<IUsuarioLogado | null>(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    return usuarioSalvo ? (JSON.parse(usuarioSalvo) as IUsuarioLogado) : null;
  });

  useEffect(() => {
    if (usuarioLogado) {
      const buscarUsuarios = async () => {
        const res = await api.get<IUsuario[]>('/usuarios');
        setUsuarios(res.data);
      };
      buscarUsuarios();
    }
  }, [usuarioLogado]);

  const carregarUsuarios = async () => {
    const res = await api.get<IUsuario[]>('/usuarios');
    setUsuarios(res.data);
  };

  const handleLogin = (usuario: IUsuarioLogado) => {
    setUsuarioLogado(usuario);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuarioLogado(null);
    setUsuarios([]);
  };

  const abrirModalNovo = () => {
    setUsuarioEditando(null);
    setModalAberto(true);
  };

  const abrirModalEditar = async (id: string) => {
    const res = await api.get<IUsuario>(`/usuarios/${id}`);
    setUsuarioEditando(res.data);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setUsuarioEditando(null);
  };

  const salvarUsuario = async (dados: CriarUsuarioForm | AtualizarUsuarioForm) => {
    try {
      const payload = { ...dados };
      if (!payload.senha) delete payload.senha;

      if (usuarioEditando) {
        await api.put(`/usuarios/${usuarioEditando._id}`, payload);
      } else {
        await api.post('/usuarios', payload);
      }
      fecharModal();
      carregarUsuarios();
    } catch (err) {
      const mensagem = (err as IAxiosError).response?.data?.erro ?? 'Erro ao salvar usuário';
      alert(mensagem);
    }
  };

  const excluirUsuario = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      carregarUsuarios();
    } catch (err) {
      const mensagem = (err as IAxiosError).response?.data?.erro ?? 'Erro ao excluir usuário';
      alert(mensagem);
    }
  };

  if (!usuarioLogado) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <Header
        onNovo={abrirModalNovo}
        usuarioLogado={usuarioLogado}
        onLogout={handleLogout}
      />
      <TabelaUsuarios
        usuarios={usuarios}
        onEditar={abrirModalEditar}
        onExcluir={excluirUsuario}
        usuarioLogado={usuarioLogado}
      />
      {modalAberto && (
        <Modal
          titulo={usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
          onFechar={fecharModal}
        >
          <FormUsuario
            usuarioInicial={usuarioEditando}
            onSalvar={salvarUsuario}
            onCancelar={fecharModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;