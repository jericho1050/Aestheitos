import { createContext, useReducer, useEffect, useState, useContext } from "react";
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext(null);
export const AuthDispatchContext = createContext(null);
export const AccessTokenExpContext = createContext(null);
export const CurrentTimeContext = createContext(null);



// eslint-disable-next-line react-refresh/only-export-components, react/prop-types
export function AuthProvider({ children }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [token, dispatch] = useReducer(authReducer, { access: null, refresh: null });
    const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
    const access = token['access'];
    let decoded = null;
    if (access !== null) {
      decoded = jwtDecode(access);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Math.floor(Date.now() / 1000));
        }, 1000); // update every second
        return () => clearInterval(interval); // cleanup on unmount
    }, []);

    return (
        <AuthContext.Provider value={token}>
            <AuthDispatchContext.Provider value={dispatch}>
                <AccessTokenExpContext.Provider value={decoded}>
                    <CurrentTimeContext.Provider value={currentTime}>

                                {children}

                    </CurrentTimeContext.Provider>
                </AccessTokenExpContext.Provider>
            </AuthDispatchContext.Provider>
        </AuthContext.Provider>
    )

}
// used to manage the user's authentication state on the client-side,
// eslint-disable-next-line react-refresh/only-export-components
export function authReducer(state, action) {
    switch (action.type) {
        case 'setToken':
            return { ...state, access: action.access, refresh: action.refresh }
        case 'removeToken':
            // eslint-disable-next-line no-case-declarations, no-unused-vars
            return {};
    }
}



export function useAuthToken() {
    return {token: useContext(AuthContext), dispatch: useContext(AuthDispatchContext)}
}