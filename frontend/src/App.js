import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import mapboxgl from 'mapbox-gl'; 

import NavBar from './Shared/Navigation/NavBar';
import Users from './Users/Pages/Users';
import AddPlace from './Places/Pages/addPlace';
import EditPlace from './Places/Pages/editPlace';
import UserPlaces from './Users/Pages/UserPlaces';
import JoinUs from './Users/Pages/JoinUs';
import { AuthContext } from './Context/authContext';
import { useEffect, useState } from 'react';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hlaGFiLWZla3J5IiwiYSI6ImNsODk0eDhkdzAzM2Izb2xhc3ExaGlvNzAifQ.xq9aZ4H9CX2NJ0M8dtNQyA';

function App() {
  let [token, setToken] = useState(null)
  let [userID, setUserID] = useState('')

  // keeping the user logged in after refresh
  useEffect(() => {
    let storedToken = localStorage.getItem('token');
    let storedID = localStorage.getItem('id');
    if(storedToken && storedID){
      setToken(storedToken)
      setUserID(storedID)
    }
    else logout()
  }, [])

  const login = (user, token) => {
    setUserID(user[0]._id);
    setToken(token);
    localStorage.setItem('token', token)
    localStorage.setItem('id', user[0]._id)
  }

  const logout = () => {
    setUserID('');
    setToken(null);
    localStorage.removeItem('token')
    localStorage.removeItem('id')
  }


  // Routes Protection
  let routes;
  if(!!token){
    routes = (
      <Routes>
        <Route path='/' exact element={<Users/>}/>
        <Route path='/places/new' exact element={<AddPlace/>}/>
        <Route path='/places/:placeID' element={<EditPlace/>}/>
        <Route path='/:userID/places' exact element={<UserPlaces/>}/>
        <Route path='*' element={<Users/>}/>
      </Routes>
    )
  } else {
    routes = (
      <Routes>
          <Route path='/' exact element={<Users/>}/>
          <Route path='/joinus' exact element={<JoinUs/>}/>
          <Route path='/:userID/places' exact element={<UserPlaces/>}/>
          <Route path='*' element={<Users/>}/>
      </Routes>
    )
  }

  return (
    <AuthContext.Provider value={{token: token, isLogedIn: !!token, userID: userID, login: login, logout: logout}}>
      <BrowserRouter>
        <NavBar/>
        {routes}
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;




// BrowserRouter  => must have as a wrapper for usability
// Routes         => switch replacement to stop rendering when Route match
// Route          => a route to be rendered
// path='*'       => to render an element when no Route match 

// Note: dynamic routes (with parms) which can accept multiple routs
// should be placed at the end Ex: EditPlace, AddPlace 