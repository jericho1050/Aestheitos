import { useContext, useEffect } from "react";
import validateJWTToken from "./verifySignature";
import { useAuthToken } from "../contexts/authContext";
import { SetIsLoadingContext } from "../contexts/IsLoadingContext";

 
 // handle jwt in state  when user refreshes page.
  // for PRESERVATION OF STATE (because state doesn't survive a refresh of page)
// token is initialized to null when page loads, so this will run or mounts after a refresh.
export default function persistJWT() {
  const setIsLoading = useContext(SetIsLoadingContext);

    const {dispatch} = useAuthToken();
    useEffect(() => {
        (async () => {
          const response = await validateJWTToken(); // returns both access and refresh token
          setIsLoading(false);
          if (response?.access && response?.refresh) {
            dispatch({
              type: 'setToken',
              access: response['access'],
              refresh: response['refresh']
            })
          }
        })(); // calls the nameless async fn
      }, []);

    }