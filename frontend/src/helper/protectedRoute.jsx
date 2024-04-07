import {useEffect } from "react";
import { Outlet, useNavigate, useNavigation, } from "react-router-dom";
import { useAuthToken } from "./authContext";
import validateJWTToken from "./verifySignature";


export default function ProectedRoute() {
  const { token } = useAuthToken();
  let isAuthenticated = token['access'] !== null;
  const navigate = useNavigate();


  // // here we are persisting log in state
  // useEffect(() => {
  //   const verifyRefreshToken = async () => {
  //     try {
  //       await persistToken();
  //     }
  //     catch (err) {
  //       console.error(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   !isAuthenticated ? verifyRefreshToken() : setIsLoading(false);

  // }, []);


  useEffect(() => {
    (async () => {
    const hasToken = await validateJWTToken();
    if (!isAuthenticated && !hasToken) {
      navigate('/signin')
    }
  })();
  }, [isAuthenticated])

  return (
    <>

     <Outlet />
    </>


  )

}