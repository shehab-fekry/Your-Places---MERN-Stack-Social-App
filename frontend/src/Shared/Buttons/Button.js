import React from "react";
import {Link} from 'react-router-dom';

const Button = (props) => {
    if(props.href){
        return <a className={props.class} href={props.href}> {props.children} </a>
    }

    if(props.to){
        return <Link className={props.class} to={props.to} exact={props.exact}> {props.children} </Link>
    }

    return <button 
    className={props.class} 
    type={props.type} 
    onClick={props.onClick}
    disabled={props.disabled}> {props.children} </button>
}

export default Button;