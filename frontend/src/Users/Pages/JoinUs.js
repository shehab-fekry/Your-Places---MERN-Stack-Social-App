import React, {useContext, useState} from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import styles from '../../Places/Pages/addPlace.module.css';
import Input from '../../Shared/Input/Input';
import Button from '../../Shared/Buttons/Button';
import btnStyle from '../../Shared/Buttons/Buttons.module.css';
import { AuthContext } from "../../Context/authContext";

const JoinUs = () => {
    let auth = useContext(AuthContext);
    let navigate = useNavigate();
    
    let [state, setState] = useState({
        inputs: [
            {
                element: 'input',
                type: 'text',
                label: 'Name',
                value: '',
                placeholder: 'Ex: Mark',
                validation: {
                    isRequired: true,
                    minLen: 5,
                },
                isValid: false,
                errorMessage: 'required, min-length 5 chars',
            },
            {
                element: 'input',
                type: 'email',
                label: 'Email',
                value: '',
                placeholder: 'Ex: example@email.com',
                validation: {
                    isRequired: true,
                    minLen: 5,
                },
                isValid: false,
                errorMessage: 'required',
            },
            {
                element: 'input',
                type: 'password',
                label: 'Password',
                value: '',
                placeholder: '************',
                validation: {
                    isRequired: true,
                    minLen: 5,
                },
                isValid: false,
                errorMessage: 'required, at least 1 uppercase, 1 special char',
            },
            {
                element: 'input',
                type: 'password',
                label: 'Confirm Password',
                value: '',
                placeholder: '************',
                isValid: false,
                errorMessage: 'passwords must match',
            },
        ],
        overallValidation: false,
        isSignUp: false,
    })

    const switchRegisterMode = () => {
        let newState = {...state}
        newState.isSignUp = !state.isSignUp;
        newState.overallValidation = false;
        newState.inputs.forEach(input => {
            input.value = '';
            input.isValid = false;
        })
        setState(newState)
    }

    const registerHandler = () => {
        let mode = state.isSignUp;
        let data = {};
        let inputValues = [];

        state.inputs.forEach(input => {
            inputValues.push(input.value);
        })

        if(mode === true){
            data = {};
            data['name'] = inputValues[0];
            data['email'] = inputValues[1];
            data['password'] = inputValues[2];
            data['confirmPassword'] = inputValues[3];
            axios.post('http://localhost:8000/api/users/signup', data)
            .then(response => {
                console.log(response)
                let {newUser, token, message, errors} = response.data;
                if(token){
                    navigate( '/joinus');
                    let newState = {...state};
                    newState.isSignUp = false;
                    setState(newState);
                }
            })
            .catch(err => console.log(err));
        }
        else{
            data = {}
            data['email'] = inputValues[1];
            data['password'] = inputValues[2];
            axios.post('http://localhost:8000/api/users/signin', data)
            .then(response => {
                let {user, token, message} = response.data;
                console.log(response)
                if(token){
                    auth.login(user, token)
                    navigate( '/');
                }

            })
            .catch(err => console.log(err));
        }
    }

    const registerSwitchInputs = () => {
        let newInputs = [];

        if(!state.isSignUp){
            newInputs.push(state.inputs[1])
            newInputs.push(state.inputs[2])
        } else {
            newInputs = state.inputs;
        }
        console.log('rendered')
        return newInputs;
    } 

    const onChangeHandler = (event, index) => {
        let inputValue = event.target.value;

        // validating inputs
        switch(index)
        {
            case 0:{
                validateName(inputValue, index);
                break;
            }
            case 1:{
                validateEmail(inputValue, index);
                break;
            }
            case 2:{
                validatePassword(inputValue, index);
                break;
            }
            case 3:{
                validateconfirmPass(inputValue, index);
                break;
            }
            default:
                break;
        }

        overallValidation()
    }

    const validateName = (value, index) => {
        let { isRequired, minLen } = state.inputs[index].validation;
        let validity = true;

        if(isRequired && (value.length > minLen))
        validity = validity && true;
        else
        validity = validity && false;

        saveValidation(value, index, validity)
    }

    const validateEmail = (value, index) => {
        let { isRequired, minLen } = state.inputs[index].validation;
        let validity = true;

        if(isRequired && (value.length > minLen))
        validity = validity && true;
        else
        validity = validity && false;

        saveValidation(value, index, validity)
    }

    const validatePassword = (value, index) => {
        let { isRequired, minLen } = state.inputs[index].validation;
        let validity = true;

        if(isRequired && (value.length > minLen))
        validity = validity && true;
        else
        validity = validity && false;

        saveValidation(value, index, validity)
    }

    const validateconfirmPass = (value, index) => {
        let password = state.inputs[2].value;
        let validity = true;

        if(value === password)
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

        // determines on whome (inputs) the overall validity should by applied.
        let inputs = registerSwitchInputs()

        inputs.forEach(input => {
            validty = validty && input.isValid;            
        })

        setState({
            ...state,
            overallValidation: validty,
        })
    }


    return (
        <div className={styles.addPlace}>
            <div className={styles.card}>
                {
                state.inputs.map((input, index) => {
                    if(!state.isSignUp && (input.label === 'Name' || input.label === 'Confirm Password')){
                        return null
                    }
                    else{
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
                    }
                })
                }
                
                <div className={styles.card_actions}>
                    <Button 
                    class={`${btnStyle.pink} ${btnStyle.btn} ${btnStyle.marginLeft}`}
                    onClick={registerHandler}
                    disabled={!state.overallValidation}>{state.isSignUp ? 'Sign Up' : 'Sign In'}</Button>
                    <Button
                    class={`${btnStyle.inverse} ${btnStyle.btn} ${btnStyle.marginLeft}`}
                    onClick={switchRegisterMode}>{!state.isSignUp ? 'Sign Up' : 'Sign In'}</Button>
                </div>
            </div>
        </div>
    )
}

export default JoinUs;