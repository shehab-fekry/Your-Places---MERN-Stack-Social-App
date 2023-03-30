import React, {useState, useRef, useContext} from "react";
import mapboxgl from 'mapbox-gl';
import { useParams, useNavigate} from 'react-router-dom';
import styles from './placeItem.module.css';
import Button from '../../Shared/Buttons/Button';
import btnStyle from '../../Shared/Buttons/Buttons.module.css';
import Modal from '../../Shared/Modal/Modal';
import { AuthContext } from "../../Context/authContext";
import axios from "axios";


const PLaceItem = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    let auth = useContext(AuthContext);
    const [isModalOpen, setIsModalOPen] = useState(false);
    const mapContainer = useRef(null);
    let map = useRef(null);
    let marker = useRef(null);

    const modalStatusHandler = () => setIsModalOPen(!isModalOpen);

    const showMap = () => {
        const [lng, lat] = props.coordinates;
        map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: 12,
        })
        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), "top-right");
        
        // Create default markers
        marker = new mapboxgl.Marker({color: '#ff0055'}).setLngLat([lng, lat]).addTo(map); 
        modalStatusHandler()
    }

    const deletePost = (id) => {
        // console.log(id)
        axios.delete(`http://localhost:8000/api/places/${id}/${auth.userID}`, {headers: {Authorization: 'bearer ' + auth.token}})
        .then(result => {
            // console.log(result)
            navigate({to:'/'})
        })
        .catch(err => console.log(err))
    }

    return (
        <React.Fragment>
            <Modal 
            isOpen={isModalOpen}
            onClick={modalStatusHandler}
            headerChildren={<h2>Location Map</h2>}
            footerChildren={<Button class={`${btnStyle.btn} ${btnStyle.inverse} ${btnStyle.marginRight}`} onClick={modalStatusHandler}>Close</Button>}>
                <div ref={mapContainer} className={styles.mapContainer}></div>
            </Modal>
            <div className={styles.placeItem}>
                <div className={styles.placeItem_image}>
                    <img src={props.imagePath} alt={props.title}/>
                </div>
                <div className={styles.placeItem_info}>
                    <h2>{props.title}</h2>
                    <h3>{props.address}</h3>
                    <p>{props.description}</p>
                </div>
                <hr/>
                <div className={styles.placeItem_actions}>
                    <Button class={`${btnStyle.inverse} ${btnStyle.btn}`} onClick={showMap}>View On Map</Button>
                    {auth.token && (auth.userID == params.userID) && (
                        <Button class={`${btnStyle.pink} ${btnStyle.btn}`} to={`/places/${props.id}`}>Edit</Button>
                    )}
                    {auth.token && (auth.userID == params.userID) && (
                    <Button class={`${btnStyle.danger} ${btnStyle.btn}`} onClick={() => {deletePost(props.id)}}>Delete</Button>
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}

export default PLaceItem;