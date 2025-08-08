import React, { useEffect } from "react";
import Login from './components/Login';
import Spotify from "./components/Spotify";
import { useStateProvider } from "./utils/StateProvider";
import { reducerCases } from "./utils/Constants";

export default function App() {
  const [{ token }, dispatch] = useStateProvider();
  
  useEffect(() => {
    const hash = window.location.hash;
    console.log("Current URL:", window.location.href);
    console.log("Hash:", hash);
    
    if (hash) {
      const token = hash.substring(1).split("&")[0].split('=')[1];
      console.log("Extracted token:", token);
      
      if (token) {
        // Fixed: Use payload instead of token
        dispatch({ type: reducerCases.SET_TOKEN, payload: token });
        // Clear the hash from URL to prevent reprocessing
        window.location.hash = "";
      }
    }
  }, [dispatch]); // Removed token from dependency array to prevent infinite loops
  
  return (
    <div>
      {token ? <Spotify /> : <Login />}
    </div>
  );
}