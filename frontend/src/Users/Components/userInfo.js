import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import styles from './userInfo.module.css';
import axios from 'axios';

const UserInfo = (props) => {
    const params = useParams();
    console.log(params)
    let [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${params.userID}`)
        .then(data => {
            let newUser = {...data.data.user};
            newUser.count = newUser.places.length;
            setUserInfo(newUser);
        })
        .catch(err => console.log(err))
    }, [params])


    return (
        <div className={styles.userInfo}>
            <div className={styles.image_side}>
                <div className={styles.image_side_left}>
                    <img src={`http://localhost:8000/${userInfo.imagePath}`}/>
                </div>
                <div className={styles.image_side_right}>
                    <div>{userInfo.name}</div>
                </div>
            </div>
            <div className={styles.info_side}>
                <div>{`${userInfo.count || 0} ${userInfo.count === 1 ? 'place' : 'places'}`}</div>
            </div>
        </div>
    )
}

export default UserInfo;