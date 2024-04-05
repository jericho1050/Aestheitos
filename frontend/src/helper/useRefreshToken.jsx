import { useContext, useEffect } from "react";
import refreshAccessToken from "./refreshAccessToken";
import { AccessTokenExpContext, CurrentTimeContext, useAuthToken} from "./authContext";


//ACCESS/REFRESH LOGIC here
export default function useRefreshToken() {
    const { token, dispatch } = useAuthToken();
    const currentTime = useContext(CurrentTimeContext);
    const accessTokenExp = useContext(AccessTokenExpContext);

    // refreshing the access token when it expires, use refresh token
    // persist user authentication == true
    useEffect(() => {
        const hasToken = token['access'] !== null;
        // console.log(hasToken);
        (async () => {

            if (hasToken) {
                // console.log(`current time: ${currentTime}`);
                // console.log(`expiration: ${accessTokenExp.exp}`);
                if (currentTime > accessTokenExp.exp) {
                    // console.log("expires!");
                    const accessToken = await refreshAccessToken(token['refresh'])
                    // console.log(`this is the ACCESS TOKEN RETURNED ${accessToken}`);
                    dispatch({
                        type: 'setToken',
                        access: accessToken,
                        refresh: token['refresh']
                    })
                    // console.log('set isAuthentocated to true')
                }
            } 
        })(); // calls the nameless async fn

    }, [currentTime]);

    return token['access'];

}