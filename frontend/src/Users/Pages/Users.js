import React, { useEffect, useState, useContext } from 'react';
import styles from './Users.module.css'
import UserList from '../Components/userList';
import axios from 'axios';
import { AuthContext } from '../../Context/authContext';

const Users = () => {
    const auth = useContext(AuthContext);
    let [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/api/users')
        .then(data => {
            // console.log(data.data.users);
            setUsers(data.data.users);
        })
        .catch(err => console.log(err));
    }, [])

    return <div className={styles.users_page}><UserList users={users}/></div>
}

export default Users;