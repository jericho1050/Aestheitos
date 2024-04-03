import { useContext, useEffect } from "react";
import { Outlet, useNavigate, useNavigation, } from "react-router-dom";
import { IsAuthenticatedContext } from "./authContext";


export default function ProectedRoute() {
    const isAuthenticated = useContext(IsAuthenticatedContext);
    const navigation = useNavigation();
    const navigate = useNavigate();


    useEffect(() => {
        if (!isAuthenticated) {
          navigate('/signin');
        }
      }, [isAuthenticated, navigate]);
    

    return (
         <div id="detail"
            className={
                navigation.state === "loading" ? "loading" : ""
            }>
            <Outlet></Outlet>
        </div> 
    )





}