import React, {useContext, useEffect, useState} from "react";
import {useParams, useNavigate} from 'react-router-dom';
import styles from '../../Users/Pages/joinUs.module.css';
import Input from '../../Shared/Input/Input';
import Button from '../../Shared/Buttons/Button';
import btnStyle from '../../Shared/Buttons/Buttons.module.css';
import axios from "axios";
import { AuthContext } from "../../Context/authContext";

const EditPlace = () => {
    const params = useParams();
    const auth = useContext(AuthContext);
    const navigate = useNavigate(); 

    let [coordinates, setCoordinates] = useState({lat: 0.0, lng:0.0});
    let [id, setID] = useState('');

    let [state, setState] = useState({
        inputs: [
            {
                element: 'input',
                type: 'text',
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
        ],
        overallValidation: false,
        toBeUpdatedPlace: {},
    })

    useEffect(() => {
        axios.get(`http://localhost:8000/api/places/${params.placeID}`)
        .then(data => {
            let place = data.data.place;    
            let newState = {...state}
            
            console.log(place)

            newState.inputs[0].value = place.imageURL;
            newState.inputs[1].value = place.title;
            newState.inputs[2].value = place.description;
            newState.inputs[3].value = place.address;
            newState.inputs.forEach(input => input.isValid = true)

            setCoordinates(place.coordinates);
            setID(place._id);
            
            setState({...newState})
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
                validateImage(inputValue, index);
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

    const validateImage = (value, index) => {
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
        let updatedPlace = {};

        updatedPlace.imageURL = state.inputs[0].value;
        updatedPlace.title = state.inputs[1].value;
        updatedPlace.description = state.inputs[2].value;
        updatedPlace.address = state.inputs[3].value;
        updatedPlace.creator = auth.userID;
        updatedPlace.coordinates = coordinates;
        updatedPlace._id = id;

        console.log(updatedPlace);

        axios.patch(`http://localhost:8000/api/places/${params.placeID}`, updatedPlace, {headers: {Authorization: 'bearer ' + auth.token}})
        .then(res => {
            console.log(res)
            navigate(`/${auth.userID}/places`);
        })
        .catch(err => console.log(err))
    }

    return (
        <div className={styles.joinus}>
            <div className={styles.card}>
                {
                state.inputs.map((input, index) => {
                    return <Input
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
        </div>
    )
}

export default EditPlace;