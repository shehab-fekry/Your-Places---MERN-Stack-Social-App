import React from 'react';
import styles from './userList.module.css'
import UserItem from './userItem';
import Spinner from '../../Shared/Spinner/Spinner';


const userList = (props) => {

    let content = (<div className={styles.error}><Spinner/></div>);

    if(!props.users){
        content = <div className={styles.userList}><img src={`${process.env.PUBLIC_URL}/Dicovery.svg`}/></div>
    } 
    else if (props.users)
    {
        content = <div className={styles.userList}>
            {
            props.users.map(user => {
                return <UserItem
                id = {user._id}
                key = {user._id}
                name = {user.name}
                image = {user.imagePath}
                placeCount = {user.places.length}
                />
            })
            }
        </div>
    } 

    return content
}

export default userList;