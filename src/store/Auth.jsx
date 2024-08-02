import React,{createContext, useContext, useState,useEffect } from "react";
import { CONFIGS } from "../../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>{
    // const [token,setToken]= useState(""); 
    const [token,setToken]= useState(localStorage.getItem("token"));
    const [user,setUser] = useState('');
    const [isLoading,setIsLoading] = useState(true);
   
    const AuthorizationToken = `Bearer ${token}`;

 

    const storeTokenInLS = (serverToken)=>{
        setToken(serverToken);
        return localStorage.setItem("token",serverToken);
    };

    let isLoggedIn  = !!token;
    console.log("isloogg",isLoggedIn);
// console.log(`user info${user}`);
    // tackling logout funcionality
    const LogoutUser = ()=>{
        setToken("");
        setUser("");
        return localStorage.removeItem("token");
    }

    //jwt authentication - currently logged in user

    const userAuthentication = async() =>{
        try {
            setIsLoading(true);
                const response = await fetch(`${CONFIGS.API_BASE_URL}/user`,
                {
                    method : "GET",
                    headers:{
                    Authorization : AuthorizationToken , 
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.userData);
                    console.log('hello',data);
                    setIsLoading(false);
                }else
                {
                    console.log('error fetching userdata')
                    setIsLoading(false);
                }
            }
         catch (error) {
            console.error("Error Fetching user data",error)
        }
    }

    
    useEffect(() => {
        
        userAuthentication();
        // LogoutUser();
    }, [token])
    

    // token
    return(
     <AuthContext.Provider value={{isLoggedIn,storeTokenInLS,LogoutUser,user}}>
    {children}
    </AuthContext.Provider>
    )
}
export const useAuth = ()=>{
    const AuthContextValue =  useContext(AuthContext);
    if(!AuthContextValue)
    {
     throw new Error("useAuth used Outside of the provider");
    }
    return AuthContextValue;
} 