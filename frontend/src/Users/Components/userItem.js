import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/authContext';

import styles from './userItem.module.css';

const userItem = (props) => {
    let auth = useContext(AuthContext);

    let userItemStyle = [styles.item_container];
    if(props.id == auth.userID)
    userItemStyle.push('current');

    
    return (
        <Link className={styles.textNone} to={`/${props.id}/places`}>
            <div className={userItemStyle.join(' ')}>
                <div className={styles.item_head}>
                    <img src={props.image} alt={props.name}></img>
                </div>
                <div className={styles.item_body}>
                    <div>{props.name}</div>
                    <div className={styles.count}>{props.placeCount > 1 ? `${props.placeCount} Places` : `${props.placeCount} Place`}</div>
                </div>
            </div>
        </Link>
    )
}

export default userItem;