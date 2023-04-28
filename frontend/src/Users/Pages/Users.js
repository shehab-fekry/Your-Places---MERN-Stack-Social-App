import React, { useEffect, useState } from 'react';
import styles from './Users.module.css'
import UserList from '../Components/userList';
import axios from 'axios';

const Users = () => {    
    let [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/api/users')
        .then(data => {
            setUsers(data.data.users);
        })
        .catch(err => console.log(err));
    }, [])

    return <div className={styles.users_page}><UserList users={users}/></div>
}

export default Users;