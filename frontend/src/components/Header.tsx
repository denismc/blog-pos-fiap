import type { IUsuarioLogado } from '../interfaces/IUsuarioLogado';

export type Tela = 'posts' | 'usuarios';

interface HeaderProps {
  tela: Tela;
  onMudarTela: (tela: Tela) => void;
  usuarioLogado: IUsuarioLogado;
  onLogout: () => void;
}

function Header({ tela, onMudarTela, usuarioLogado, onLogout }: HeaderProps) {
  const isAdmin = usuarioLogado.perfil === 'Administrador';

  return (
    <header className="header">
      <div className="header-titulo">
        <h1>Blog Pós FIAP</h1>
        <nav className="header-nav">
          <button className={tela === 'posts' ? 'aba-ativa' : ''} onClick={() => onMudarTela('posts')}>
            Posts
          </button>
          {isAdmin && (
            <button className={tela === 'usuarios' ? 'aba-ativa' : ''} onClick={() => onMudarTela('usuarios')}>
              Usuários
            </button>
          )}
        </nav>
      </div>
      <div className="header-acoes">
        <span className="usuario-logado">
          {usuarioLogado.nome} ({usuarioLogado.perfil})
        </span>
        <button className="btn-logout" onClick={onLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}

export default Header;
