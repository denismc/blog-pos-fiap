import type { IUsuarioLogado } from '../interfaces/IUsuarioLogado';

interface HeaderProps {
  onNovo: () => void;
  usuarioLogado: IUsuarioLogado;
  onLogout: () => void;
}

function Header({ onNovo, usuarioLogado, onLogout }: HeaderProps) {
  const isAdmin = usuarioLogado.perfil === 'Administrador';

  return (
    <header className="header">
      <h1>Cadastro de Usuários</h1>
      <div className="header-acoes">
        <span className="usuario-logado">
          {usuarioLogado.nome} ({usuarioLogado.perfil})
        </span>
        {isAdmin && (
          <button className="btn-novo" onClick={onNovo}>
            + Novo Usuário
          </button>
        )}
        <button className="btn-logout" onClick={onLogout}>
          Sair
        </button>
      </div>
    </header>
  )
}

export default Header;