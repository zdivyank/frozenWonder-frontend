import React,{ useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../store/Auth';

export const Logout = () =>{
    const { LogoutUser,isLoggedIn } = useAuth();
    useEffect(() => {
      LogoutUser();
    }, [LogoutUser,isLoggedIn]);
    return <Navigate to="/login"/>
}