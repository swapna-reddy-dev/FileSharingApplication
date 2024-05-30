import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UsersContext } from "../ContextApi/usersContext";

export default function PrivateRoutes({children}) {
    const {users} = useContext(UsersContext)
    const token = localStorage.getItem('token')
    console.log(token,'dd')
    console.log(users,'')

    if(!users && token) {
        return <h1>Loding...</h1>
    }
    if(!users) {
        return <Navigate to={'/login'}/>
    }

    return children
}