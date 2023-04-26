import React, { useState, useEffect, useContext } from "react";
import PlaceItem from './placeItem';
import styles from './placeList.module.css';
import { useParams } from 'react-router-dom';
import Button from "../../Shared/Buttons/Button";
import btnStyle from '../../Shared/Buttons/Buttons.module.css';
import axios from "axios";
import { AuthContext } from "../../Context/authContext";
import Spinner from "../../Shared/Spinner/Spinner";

const PLaceList = (props) => {
    const params = useParams();
    let auth = useContext(AuthContext);
    let [isLoaded, setIsLoaded] = useState(false);
    let [places, setPlaces] = useState([]);


    // params.userID is used as dependency in useEffect for navigating 
    // (page content changing) between (my places) and (other users profile) 
    useEffect(() => {
        axios.get(`http://localhost:8000/api/places/${params.userID ? params.userID : auth.userID}/places`)
        .then(data => {
            // console.log(data.data.places);
            let newPlaces = data.data.places?.map(p => {
                return {...p, coordinates: [p.coordinates.lat, p.coordinates.lng]}
            })
            setPlaces(newPlaces);
            setIsLoaded(true);
        })
        .catch(err => console.log(err));
    }, [params.userID])
    
    let filterPlaces = [];
    filterPlaces = places ? places.filter(place => place.creator === params.userID.toString()) : [];

    let content = (
        filterPlaces?.map(place => {
            return <PlaceItem 
            key={place._id} 
            id={place._id}
            imagePath={place.imagePath ? `http://localhost:8000/${place.imagePath}` : 'https://placehold.co/600x400'}
            title={place.title}
            description={place.description}
            address={place.address}
            coordinates={place.coordinates}/>
        })
    )

    // for loged-in user
    if(filterPlaces?.length == 0 && auth.isLogedIn && params.userID == auth.userID)
    content = (
        <div className={styles.noContent}>
            <h2>No Places yet, Create new?</h2>
            <Button class={`${btnStyle.btn} ${btnStyle.pink}`} exact to='/places/new'>Add New</Button>
        </div>
    )
    // for other users
    else if(filterPlaces.length == 0)
    content = (
        <div className={styles.noContent}>
            <h2>No new places added recently</h2>
        </div>
    )

    return <div className={styles.placeList}>{isLoaded ? content : <Spinner/>}</div>
}

export default PLaceList;