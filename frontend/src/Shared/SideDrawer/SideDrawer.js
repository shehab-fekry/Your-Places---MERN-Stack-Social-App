import React from "react";
import styles from './SideDrawer.module.css';
import NavLinks from '../Navigation/NavLinks';

const SideDrawer = (props) => {
    return <div 
    className={styles.SideDrawer} 
    style={{
        transform: props.isOpen ? 'translateX(0)' : 'translateX(-100vh)',
        opacity: props.isOpen ? '1' : '0',
    }}>
        <NavLinks onClick={props.onClick}/>
    </div>
}

export default SideDrawer;