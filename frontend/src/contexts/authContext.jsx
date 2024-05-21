import { createContext, useReducer, useEffect, useState, useContext } from "react";
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext(null);
export const AuthDispatchContext = createContext(null);
export const AccessTokenDecodedContext = createContext(null);



// eslint-disable-next-line react-refresh/only-export-components, react/prop-types
export function AuthProvider({ children }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [token, dispatch] = useReducer(authReducer, { access: null, refresh: null });
    const access = token['access'];
    let decoded;
    if (typeof access === 'string') {
      decoded = jwtDecode(access);
    }



    return (
        <AuthContext.Provider value={token}>
            <AuthDispatchContext.Provider value={dispatch}>
                <AccessTokenDecodedContext.Provider value={decoded}>

                                {children}

                </AccessTokenDecodedContext.Provider>
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