import React from "react";
import styles from './SideDrawer.module.css';

const DropBack = (props) => {
    return <div 
    className={styles.DropBack} 
    onClick={props.onClick}
    style={{
        display: props.isOpen ? 'block' : 'none',
    }}></div>
}

export default DropBack;