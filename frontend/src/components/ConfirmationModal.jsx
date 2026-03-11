import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, action, message }) => {
    if (!isOpen) return null;

    const isDelete = action === 'delete';

    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <div className="modal-body text-center" style={{ padding: '32px 26px 24px' }}>
                    <div className={`confirm-icon-wrap ${isDelete ? 'is-delete' : 'is-update'}`}>
                        {isDelete
                            ? <AlertTriangle size={22} />
                            : <RefreshCw size={22} />}
                    </div>
                    <h3>{isDelete ? 'Delete Student' : 'Update Student'}</h3>
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className={`btn ${isDelete ? 'btn-danger' : 'btn-primary'}`}
                        onClick={onConfirm}
                    >
                        {isDelete ? 'Yes, Delete' : 'Yes, Update'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
