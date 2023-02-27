import React from 'react';
import styles from './userList.module.css'
import UserItem from './userItem';
import Spinner from '../../Shared/Spinner/Spinner';


const userList = (props) => {
    if(props.users.length == 0){
        return <div className={styles.error}><Spinner/></div>
    }

    return (
        <div className={styles.userList}>
            {
            props.users.map(user => {
                return <UserItem
                id = {user._id}
                key = {user._id}
                name = {user.name}
                image = {user.image}
                placeCount = {user.places.length}
                />
            })
            }
        </div>
    )
}

export default userList;