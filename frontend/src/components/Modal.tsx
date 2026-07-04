function Modal({ titulo, onFechar, children }) {
  return (
    <div className="overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{titulo}</h2>
        {children}
      </div>
    </div>
  );
}

export default Modal;
