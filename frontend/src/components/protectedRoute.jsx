import {useEffect } from "react";
import { Outlet, useNavigate, useNavigation, } from "react-router-dom";
import { useAuthToken } from "../contexts/authContext";
import validateJWTToken from "../helper/verifySignature";


export default function ProectedRoute() {
  const { token } = useAuthToken();
  const isAuthenticated = token['access'] !== null;
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
    const hasToken = await validateJWTToken(); // we verify the signature of the cookie (i.e., the HTTP-only cookie in the storage)
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