import React from "react";
import styles from './Modal.module.css';
import DropBack from "../SideDrawer/DropBack";

const ModalOverlay = (props) => {
    return (
        <div className={`${styles.modal} ${props.className}`}
        style={{
            transform: props.isOpen ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: props.isOpen ? '1' : '0',
        }}>
            <header className={`${styles.modalHeader} ${props.headerClass}`}>
                {props.headerChildren}
            </header>
            <form onSubmit={props.onSubmit ? props.onSubmit : event => event.preventDefault()}>
                <div className={`${styles.modalContent} ${props.contnetClass}`}>
                    {props.children}
                </div>
                <div className={`${styles.modalFooter} ${props.footerClass}`}>
                    {props.footerChildren}
                </div>
            </form>
        </div>
    )
}


const Modal = (props) => {
    return (
        <React.Fragment>
            <ModalOverlay {...props} />
            <DropBack isOpen={props.isOpen} onClick={props.onClick}/>
        </React.Fragment>
    )
}

export default Modal;