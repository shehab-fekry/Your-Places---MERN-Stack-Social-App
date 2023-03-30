import React from "react";
import styles from './Input.module.css';

const input = (props) => {
    let content;
    if(props.element === 'input' && props.type === 'file'){
        content = (
            <div className={styles.fileCard}>
                <button className={styles.fileBtn}>Upload Image</button>
                <input
                className={styles.fileInput}
                type={props.type}
                accept="image/png, image/jpeg, image/jpg"
                onChange={props.onChange}/>
            </div>
        )
    }
    else if(props.element === 'input')
    {
        content = (
        <input
        style={{
            borderColor: !props.isValid ? 'red' : 'green',
            backgroundColor: !props.isValid ? 'rgba(255, 0, 0, 0.3)' : 'rgba(144, 238, 144, 0.5)',
        }}
        type={props.type} 
        value={props.value} 
        placeholder={props.placeholder}
        onChange={props.onChange}/>
        )
    } else {
        content = (
            <textarea
            style={{
                borderColor: !props.isValid ? 'red' : 'green',
                backgroundColor: !props.isValid ? 'rgba(255, 0, 0, 0.3)' : 'rgba(144, 238, 144, 0.5)',
            }}
            value={props.value}
            placeholder={props.placeholder}
            onChange={props.onChange}/>
        )
    }

    return (
        <div className={styles.input}>
            <div><label>{props.label}</label></div>
            <div>{content}</div>
            <div className={ `${styles.message} ${!props.isValid ? styles.error : styles.verified}`}> {!props.isValid ? `* ${props.errorMessage}` : '✔ Verified'} </div>
        </div>
    )
}

export default input;