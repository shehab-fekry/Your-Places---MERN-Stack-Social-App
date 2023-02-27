import React, {useContext} from "react";

import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';
import { AuthContext } from "../../Context/authContext";

const NavLinks = (props) => {
    let auth = useContext(AuthContext);

    const activeHandler = ({isActive}) => {
        let linkClasses = [styles.NavLink];
        if (isActive) linkClasses.push(styles.active);
        
        return linkClasses.join(" "); // returns "NavLink" or "NavLink active"
    } 

    console.log(auth)

    return (
        <div className={styles.NavBar_Links}>
            <NavLink onClick={props.onClick} className={activeHandler} exact to='/'>Discover</NavLink>
            {auth.token && (
                <NavLink onClick={props.onClick} className={activeHandler} exact to={`/${auth.userID}/places`}>My Places</NavLink>
            )}
            {auth.token && (
                <NavLink onClick={props.onClick} className={activeHandler} exact to='/places/new'>Add Place</NavLink>
            )}
            {!auth.token && (
            <NavLink onClick={props.onClick} className={activeHandler} exact to='/joinus'>Join Us</NavLink>
            )}
            {auth.token && (
                <NavLink onClick={auth.logout} className={styles.NavLink} exact to='/joinus'>LogOut</NavLink>
            )}
        </div>
    )
}

export default NavLinks;