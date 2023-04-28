import React from "react";
import { useState } from 'react';

import styles from './NavBar.module.css';
import NavLinks from './NavLinks';
import SideDrawer from '../SideDrawer/SideDrawer';
import DropBack from "../SideDrawer/DropBack";

const NavBar = () => {
    let [isMenuOpen, setIsMenuOpen] = useState(false);

    const MenuHandler = () => {
        setIsMenuOpen(!isMenuOpen)
        // console.log(isMenuOpen)
    }

    return (
        <div className={styles.NavBar}>
            <div className={styles.NavBar_Logo}>
                <div className={styles.icon} onClick={MenuHandler}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className={styles.title}>Your Places</div>
            </div>
            <SideDrawer isOpen={isMenuOpen} onClick={MenuHandler}/>
            <DropBack isOpen={isMenuOpen} onClick={MenuHandler}/>
            <div className={styles.desktopOnly}> {/* A Div to hide NavBar Links with class (desktopOnly) */}
                <NavLinks />
            </div>
        </div>
    )
}

export default NavBar;