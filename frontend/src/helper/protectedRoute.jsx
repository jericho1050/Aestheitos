import { useContext, useEffect } from "react";
import { Outlet, useNavigate, useNavigation, } from "react-router-dom";
import { useAuthToken } from "./authContext";
import { IsLoadingContext, SetIsLoadingContext } from "./IsLoadingContext";
import refreshAccessToken from "./refreshAccessToken";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';


export default function ProectedRoute() {
  const { token } = useAuthToken();
  const isAuthenticated = token['access'] !== null;
  const isLoading = useContext(IsLoadingContext);
  const setIsLoading = useContext(SetIsLoadingContext);
  const navigate = useNavigate();





  // here we are persisting log in state
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refreshAccessToken(token['refresh']);
      }
      catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    !isAuthenticated ? verifyRefreshToken() : setIsLoading(false);

  }, []);


  useEffect(() => {
    if (!isAuthenticated && !sessionStorage.getItem('isAuthenticated')) {
      navigate('/signin')
    }
  }, [isAuthenticated])

  return (
    <>

      {isLoading ? (<Box sx={{ my: '50vh', display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
        <progress value={null} />
        <p>Loading...</p>
      </Box>) 
      : <Outlet />}
    </>


  )

}