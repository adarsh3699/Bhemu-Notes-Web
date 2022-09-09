import * as React from 'react';
import Modal from '@mui/material/Modal';

import styles from './notesModal.css';

function ModalWrapper({
    open,
    closeOnOutsideClick = true,
    containerClassName,
    closeBtnClassName,
    children,
    handleModalClose,
}) {


    return (
        <Modal open={open} onClose={closeOnOutsideClick ? handleModalClose : null}>
            <div className={["modal", containerClassName].join("")}>
                {/* <div className={["close", closeBtnClassName].join("")} onClick={handleModalClose} ></div> */}
                <div className={styles.modalContent}>{children}</div>

            </div>
        </Modal>
    );
}

export default ModalWrapper;