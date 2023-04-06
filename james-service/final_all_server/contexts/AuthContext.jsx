import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/init-firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  confirmPasswordReset,
  fetchSignInMethodsForEmail,
  sendSignInLinkToEmail,
} from "firebase/auth";
import iron from "@hapi/iron";
const AuthContext = createContext({
  currentUser: null,
  signInWithGoogle: () => Promise,
  login: () => Promise,
  register: () => Promise,
  logout: () => Promise,
  forgotPassword: () => Promise,
  resetPassword: () => Promise,
  checkEmail: () => Promise,
  sendEmail: () => Promise,
});

export const useAuth = () => useContext(AuthContext);
if (useAuth === null) {
  throw new Error("useAuth must be used within an AuthContextProvider");
}

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user : null);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email, {
      url: `https://james.customix.co/`,
    });
  }

  function resetPassword(oobCode, newPassword) {
    return confirmPasswordReset(auth, oobCode, newPassword);
  }

  function logout() {
    localStorage.removeItem("authToken");
    return signOut(auth);
  }

  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }
  async function checkEmail(email) {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  }

  async function sendEmail(email) {
    try {
      const sendMail = sendSignInLinkToEmail(auth, email, actionCodeSettings);
      return sendMail;
    } catch (error) {
      console.log(" send email not to firebase google  ");
    }
  }

  const value = {
    currentUser,
    signInWithGoogle,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    checkEmail,
    sendEmail,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
