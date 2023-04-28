import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import mapboxgl from 'mapbox-gl'; 
import React, { Suspense, lazy } from 'react'
import { AuthContext } from './Context/authContext';
import { useEffect, useState } from 'react';

import NavBar from './Shared/Navigation/NavBar';
import Users from './Users/Pages/Users';
const AddPlace   = lazy(() => import('./Places/Pages/addPlace'));
const EditPlace  = lazy(() => import('./Places/Pages/editPlace'));
const UserPlaces = lazy(() => import('./Users/Pages/UserPlaces'));
const JoinUs     = lazy(() => import('./Users/Pages/JoinUs'));

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

  const login = React.useCallback((user, token) => {
    setUserID(user[0]._id);
    setToken(token);
    localStorage.setItem('token', token)
    localStorage.setItem('id', user[0]._id)
  }, [])

  const logout = React.useCallback(() => {
    setUserID('');
    setToken(null);
    localStorage.removeItem('token')
    localStorage.removeItem('id')
  }, [])


  // Routes Protection
  const routes = React.useMemo(() => {
    return !!token ? (
        <Routes>
          <Route path='/' exact element={<Users/>}/>
          <Route path='/places/new' exact element={<AddPlace/>}/>
          <Route path='/places/:placeID' element={<EditPlace/>}/>
          <Route path='/:userID/places' exact element={<UserPlaces/>}/>
          <Route path='*' element={<Users/>}/>
        </Routes>
      ) : (
        <Routes>
            <Route path='/' exact element={<Users/>}/>
            <Route path='/joinus' exact element={<JoinUs/>}/>
            <Route path='/:userID/places' exact element={<UserPlaces/>}/>
            <Route path='*' element={<Users/>}/>
        </Routes>
      )
  }, [token])

  return (
    <AuthContext.Provider value={{token, isLogedIn: !!token, userID, login, logout}}>
      <BrowserRouter>
        <NavBar/>
        <Suspense fallback={<div>loading</div>}>
          {routes}
        </Suspense>
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