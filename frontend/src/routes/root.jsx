import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../components/Appbar";
import { useNavigation } from "react-router-dom";
import persistJWT from "../helper/persistJWT";
import useRefreshToken from "../helper/useRefreshToken";
import { useContext } from "react";
import { IsLoadingContext } from "../contexts/IsLoadingContext";
import Box from '@mui/material/Box';

export default function Root() {
    const navigation = useNavigation();
    const isLoading = useContext(IsLoadingContext);

    persistJWT(); // here we are persisting log in state
    useRefreshToken(); // refreshing access token when it's due if the user has a refresh token in storage.

    return (
        <>
            <ResponsiveAppBar></ResponsiveAppBar>
            <>

                {isLoading ? (<Box sx={{ my: '50vh', display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
                    <progress value={null} />
                    <p>Loading...</p>
                </Box>)
                    : 
                    <Box id="detail"
                    className={
                      navigation.state === "loading" ? "loading" : ""
                    }
                  >
                    <Outlet />
                  </Box>
                    
                    }
            </>

        </>
    )
}