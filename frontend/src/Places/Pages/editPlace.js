import React, {useContext, useEffect, useState, useRef} from "react";
import {useParams, useNavigate} from 'react-router-dom';
import styles from './addPlace.module.css';
import Input from '../../Shared/Input/Input';
import Button from '../../Shared/Buttons/Button';
import btnStyle from '../../Shared/Buttons/Buttons.module.css';
import axios from "axios";
import { AuthContext } from "../../Context/authContext";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

const EditPlace = () => {
    const params = useParams();
    const auth = useContext(AuthContext); 
    const navigate = useNavigate(); 

    let [id, setID] = useState('');
    let [file, setFile] = useState({});
    let [state, setState] = useState({
        inputs: [
            {
                element: 'input',
                type: 'file',
                label: 'Image',
                value: '',
                placeholder: 'Ex: URL',
                validation: {
                    isRequired: true,
                },
                isValid: false,
                errorMessage: 'required, please add any image URL',
            },
            {
                element: 'input',
                type: 'text',
                label: 'Title',
                value: '',
                placeholder: 'Ex: Pyramids',
                validation: {
                    isRequired: true,
                    minLen: 5,
                },
                isValid: false,
                errorMessage: 'required, min-length of 5 chars',
            },
            {
                element: 'textArea',
                type: null,
                label: 'Description',
                value: '',
                placeholder: 'Make your description precise...',
                validation: {
                    isRequired: true,
                    minLen: 20,
                    maxLen: 200,
                },
                isValid: false,
                errorMessage: 'required, between 20 - 200 chars',
            },
            {
                element: 'input',
                type: 'text',
                label: 'Address',
                value: '',
                placeholder: 'Ex: Al Haram, Giza',
                validation: {
                    isRequired: true,
                    minLen: 5,
                },
                isValid: false,
                errorMessage: 'required, min-length of 5 chars',
            },
            {
                label: 'Coordinates',
                value: [0, 0],
                isValid: false,
            }
        ],
        overallValidation: false,
        toBeUpdatedPlace: {},
    })

    let [prevMarker, setPrevMarker] = useState(null);
    let map = useRef(null);
    let mapContainer = useRef(null);
    useEffect(() => {
        axios.get(`http://localhost:8000/api/places/${params.placeID}`)
        .then(data => {
            let place = data.data.place;    
            let newState = {...state}
            
            // console.log(place)

            // place.imagePath here is used to make the validation of image picker (verified)
            // because there is already an image for that post saved in the backend, so
            // if he didn't pick another it will not be replaced
            newState.inputs[0].value = place.imagePath;
            newState.inputs[1].value = place.title;
            newState.inputs[2].value = place.description;
            newState.inputs[3].value = place.address;
            newState.inputs[4].value = [place.coordinates.lat, place.coordinates.lng];
            newState.inputs.forEach(input => input.isValid = true)

            setID(place._id);
            setFile(place.imagePath)
            setState({...newState})

            // initializing the map
            map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: newState.inputs[4].value,
                zoom: 9,
            })

            // Create a new marker and replace it with the old 
            prevMarker = new mapboxgl.Marker({color: '#ff0055'}).setLngLat(newState.inputs[4].value).addTo(map);
            setPrevMarker(prevMarker);

            // Add navigation control (the +/- zoom buttons)
            map.addControl(new mapboxgl.NavigationControl(), "top-right");
            map.addControl(new mapboxgl.FullscreenControl());

            map.on('click', (e) => {
                let lngLat = e.lngLat;
                let latitude = lngLat.lat;
                let longitude = lngLat.lng;

                // Create a new marker and replace it with the old 
                if(prevMarker) prevMarker.remove();
                prevMarker = new mapboxgl.Marker({color: '#ff0055'}).setLngLat([longitude, latitude]).addTo(map);
                setPrevMarker(prevMarker);

                // saving and validating the coordinates
                let newState = {...state};
                newState.inputs[4].value = [longitude, latitude];
                newState.inputs[4].isValid = true;
                setState(newState);
                overallValidation()
            });

            // add geocoder to the map
            const geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                placeholder: 'Enter an address',
                marker: false,
                // marker: {
                //     color: '#ff0055',
                // }
            });
            map.addControl(geocoder, 'top-left');

            // Retrieve the latitude and longitude from the result
            geocoder.on('result', function(e) {
                let lat = e.result.center[1];
                let lng = e.result.center[0];
                if(prevMarker) prevMarker.remove();
                prevMarker = new mapboxgl.Marker({color: '#ff0055'}).setLngLat([lng, lat]).addTo(map);

                // saving and validating the coordinates
                let newState = state;
                newState.inputs[4].value = [lng, lat];
                newState.inputs[4].isValid = true;
                setState(newState);
                overallValidation()
            });

            overallValidation()
        })
        .catch(err => console.log(err))
    }, [])


    const onChangeHandler = (event, index) => {
        let inputValue = event.target.value;
        // console.log(state)

        // validating inputs
        switch(index)
        {
            case 0:{
                validateImage(inputValue, index, event);
                break;
            }
            case 1:{
                validateTitle(inputValue, index);
                break;
            }
            case 2:{
                validateDescription(inputValue, index);
                break;
            }
            case 3:{
                validateAddres(inputValue, index)
                break;
            }
            default:
                break;
        }

        overallValidation()
    }

    const validateImage = (value, index, event) => {
        const imageFile = event.target.files[0];
        setFile(imageFile);

        let { isRequired } = state.inputs[index].validation;
        let validity = true;

        if(isRequired && (value.length !== 0))
        validity = validity && true;
        else
        validity = validity && false

        saveValidation(value, index, validity)
    }

    const validateTitle = (value, index) => {
        let { isRequired, minLen } = state.inputs[index].validation;
        let validity = true;

        if(isRequired && (value.length > minLen))
        validity = validity && true;
        else
        validity = validity && false;

        saveValidation(value, index, validity)
    }

    const validateDescription = (value, index) => {
        let { isRequired, minLen, maxLen } = state.inputs[index].validation;
        let validity = true;

        if(isRequired && (value.length > minLen) && (value.length < maxLen))
        validity = validity && true;
        else
        validity = validity && false;

        saveValidation(value, index, validity)
    }

    const validateAddres = (value, index) => {
        let { isRequired, minLen } = state.inputs[index].validation;
        let validity = true;

        if(isRequired && (value.length > minLen))
        validity = validity && true;
        else
        validity = validity && false;

        saveValidation(value, index, validity)
    }

    const saveValidation = (value, index, validity) => {
        let newState = {...state};
        newState.inputs[index].value = value;
        newState.inputs[index].isValid = validity;
        setState(newState)
    }

    const overallValidation = () => {
        let validty = true;
        state.inputs.forEach(input => {
            validty = validty && input.isValid;            
        })

        setState({
            ...state,
            overallValidation: validty,
        })
    }

    const submitHandler = () => {
        let updatedPlace = new FormData();

        updatedPlace.append('imagePath', file);
        updatedPlace.append('title', state.inputs[1].value);
        updatedPlace.append('description', state.inputs[2].value);
        updatedPlace.append('address', state.inputs[3].value);
        updatedPlace.append('creator', auth.userID);
        updatedPlace.append('coordinates' ,state.inputs[4].value);
        updatedPlace.append('_id', id);

        // console.log(updatedPlace);

        axios.patch(`http://localhost:8000/api/places/${params.placeID}`, updatedPlace, {headers: {Authorization: 'bearer ' + auth.token}})
        .then(res => {
            console.log(res)
            navigate(`/${auth.userID}/places`);
        })
        .catch(err => console.log(err))
    }

    return (
        <div className={styles.addPlace}>
            <div className={styles.card}>
                <div className={styles.inputSide}>
                    {
                    state.inputs.map((input, index) => {
                        return index === 4 ? null : <Input
                        key={index}
                        element={input.element} 
                        type={input.type} 
                        label={input.label} 
                        value={input.value} 
                        placeholder={input.placeholder}
                        isValid={input.isValid}
                        errorMessage={input.errorMessage}
                        onChange={(e) => onChangeHandler(e, index)}/>
                    })
                    }
                    <Button 
                    class={`${btnStyle.pink} ${btnStyle.btn} ${btnStyle.marginLeft}`}
                    disabled={!state.overallValidation}
                    onClick={submitHandler}>Update</Button>
                </div>
                <div ref={mapContainer} className={styles.mapSide}></div>
            </div>
        </div>
    )
}

export default EditPlace;