import React from "react";
import styles from './UserPlaces.module.css';
import PlacesList from '../../Places/Components/placeList';

const UserPlaces = () => {
    return (
        <div className={styles.UserPlaces}>
            <PlacesList/>
        </div>
    )
}

export default UserPlaces;