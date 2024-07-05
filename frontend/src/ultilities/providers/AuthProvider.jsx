import React, { createContext, useEffect, useState } from 'react'
import {  GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
export const AuthContext =createContext()
import {app} from "../../config/firebase.init"
import axios from 'axios';

 const AuthProvider = ({children}) => {
   const [user,setUser]=useState(null)
   const [loader,setLoader]=useState(true)
  const [error,setError]=useState(' ')
  const auth = getAuth(app);


     const signUp =async( email, password)=>{
           try {
             setLoader(true)
             return await createUserWithEmailAndPassword(auth,email,password)
           } catch (error) {
            setError(error.code)
            throw error
           }
     }

     const login = async (email, password) => {
      try {
          setLoader(true)
          return await signInWithEmailAndPassword(auth, email, password)
      } catch (error) {
          setError(error.code)
          throw error
      }
  }
  const logout = async () => {
    try {
        return await signOut(auth)
    } catch (error) {
        setError(error.code)
        throw error
    }
}
const updateUser = async (displayName, photo) => {
  try {
      await updateProfile(auth.currentUser, { displayName: displayName, photoURL: photo })
      setUser(auth.currentUser)

  } catch (error) {
      setError(error.code)
      throw error
  }
}
const googleProvider = new GoogleAuthProvider();
const googleLogin = async () => {

    try {
        setLoader(true)
        return await signInWithPopup(auth, googleProvider)
    } catch (error) {
        setError(error.code)
        throw error
    }
}
 // Observe user state (auth)
 useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {

          axios.post('http://localhost:5000/api/set-token', { email: user.email, name: user.displayName })
              .then(data => {
                  // console.log(data.data.token)
                  if (data.data.token) {
                      localStorage.setItem('token', data.data.token);
                      setLoader(false);
                  }
              })
      }
      else {
          localStorage.removeItem('token');
          setLoader(false);
      }
  });

  return () => unsubscribe();
}, []);




    const contextValu ={loader,user,signUp,login, logout,updateUser,googleLogin}

  return (
   <AuthContext.Provider value={contextValu}>
    {children}
   </AuthContext.Provider>
  )
}

export default AuthProvider