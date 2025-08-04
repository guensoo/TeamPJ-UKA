const Modal = ({ children, onClose, title }) => (
    <div className="modal-backdrop">
        <div className="modal">
            <div className="modal-header">
                <h3 className="modal-title">{title}</h3>
                <button 
                    onClick={onClose} 
                    className="close-btn"
                    aria-label="닫기"
                >
                    ✕
                </button>
            </div>
            {children}
        </div>
    </div>
);

export default Modal;
