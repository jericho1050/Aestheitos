import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../MUI-components/Appbar";

export default function Root(){

    return (
    <>
        <ResponsiveAppBar></ResponsiveAppBar>
        <div id="detail">
            <Outlet></Outlet>
        </div>
    </>
    )
}