import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../MUI-components/Appbar";
import { useNavigation } from "react-router-dom";

export default function Root(){
    const navigation = useNavigation();
    return (
    <>
        <ResponsiveAppBar></ResponsiveAppBar>
        <div id="detail"
            className={
                navigation.state === "loading" ? "loading" : ""
            }
        >
            <Outlet></Outlet>
        </div>
    </>
    )
}