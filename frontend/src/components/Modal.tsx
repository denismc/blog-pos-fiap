import type { ReactNode } from 'react';

interface ModalProps {
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
  grande?: boolean;
}

function Modal({ titulo, onFechar, children, grande }: ModalProps) {
  return (
    <div className="overlay" onClick={onFechar}>
      <div className={grande ? 'modal modal-grande' : 'modal'} onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecalho">
          <h2>{titulo}</h2>
          <button className="btn-fechar-modal" onClick={onFechar} aria-label="Fechar">
            ×
          </button>
        </div>
        <div className="modal-conteudo">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
