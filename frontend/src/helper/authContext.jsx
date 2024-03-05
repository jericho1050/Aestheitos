import { createContext, useReducer } from "react";

export const AuthContext = createContext(null);
export const AuthDispatchContext = createContext(null);


// eslint-disable-next-line react-refresh/only-export-components, react/prop-types
export function AuthProvider({ children }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [token, dispatch] = useReducer(authReducer, {jwt: null});

    return (
        <AuthContext.Provider value={token}>
            <AuthDispatchContext.Provider value={dispatch}>
                { children }
            </AuthDispatchContext.Provider>
        </AuthContext.Provider>
    )

}
// used to manage the user's authentication state on the client-side,
// eslint-disable-next-line react-refresh/only-export-components
export function authReducer(state, action) {
    switch (action.type) {
        case 'setToken':
            return  {jwt: action.payload}
        case 'removeToken':
            // eslint-disable-next-line no-case-declarations, no-unused-vars
            return {};
        }
}
