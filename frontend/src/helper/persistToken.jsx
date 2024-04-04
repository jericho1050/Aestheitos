import { useEffect } from "react";
import validateJWTToken from "./verifySignature";
import { useAuthToken } from "./authContext";

 
 

 // handle jwt in state  when user refreshes page.
  // for PRESERVATION OF STATE (because state doesn't survive a refresh)
// token is initialized to null when page loads, so this will run after a refresh.
export default function persistToken() {
    const {dispatch} = useAuthToken();
    useEffect(() => {
        (async () => {
          const response = await validateJWTToken(); // returns both access and refresh token
          if (response['access'] && response['refresh']) {
            dispatch({
              type: 'setToken',
              access: response['access'],
              refresh: response['refresh']
            })
          }
        })(); // calls the nameless async fn
      }, []);

    }