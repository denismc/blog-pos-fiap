import { useState } from 'react';
import Header, { type Tela } from './components/Header';
import TelaPosts from './screens/TelaPosts';
import TelaUsuarios from './screens/TelaUsuarios';
import Login from './components/Login';
import './App.css';
import type { IUsuarioLogado } from './interfaces/IUsuarioLogado';

function App() {
  const [tela, setTela] = useState<Tela>('posts');

  const [usuarioLogado, setUsuarioLogado] = useState<IUsuarioLogado | null>(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    return usuarioSalvo ? (JSON.parse(usuarioSalvo) as IUsuarioLogado) : null;
  });

  const handleLogin = (usuario: IUsuarioLogado) => {
    setUsuarioLogado(usuario);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuarioLogado(null);
    setTela('posts');
  };

  if (!usuarioLogado) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <Header tela={tela} onMudarTela={setTela} usuarioLogado={usuarioLogado} onLogout={handleLogout} />
      {tela === 'posts' ? <TelaPosts usuarioLogado={usuarioLogado} /> : <TelaUsuarios usuarioLogado={usuarioLogado} />}
    </div>
  );
}

export default App;
