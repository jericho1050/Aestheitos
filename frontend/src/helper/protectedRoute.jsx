import { useContext, useEffect } from "react";
import { Outlet, useNavigate, useNavigation, } from "react-router-dom";
import { useAuthToken } from "./authContext";
import { IsLoadingContext, SetIsLoadingContext } from "./IsLoadingContext";
import refreshAccessToken from "./refreshAccessToken";


export default function ProectedRoute() {
  const {token} = useAuthToken();
  const isAuthenticated = token['access'] !== null;
  const isLoading = useContext(IsLoadingContext);
  const setIsLoading = useContext(SetIsLoadingContext);
  const navigation = useNavigation();
  const navigate = useNavigate();





  // here we are persisting log in state
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refreshAccessToken();
      }
      catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    !isAuthenticated ? verifyRefreshToken() : setIsLoading(false);

  }, []);


  if (!isAuthenticated) {
    navigate('/signin')
  }

  return (
    <>
        
        {isLoading ? <p>Loading...</p> : <Outlet />}
    </>


  )





}