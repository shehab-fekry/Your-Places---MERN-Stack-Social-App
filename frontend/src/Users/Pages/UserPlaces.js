import React from "react";
import styles from './UserPlaces.module.css';
import PlacesList from '../../Places/Components/placeList';
import UserInfo from '../Components/userInfo';

const UserPlaces = () => {
    return (
        <div className={styles.UserPlaces}>
            <UserInfo/>
            <PlacesList/>
        </div>
    )
}

export default UserPlaces;