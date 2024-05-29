import { Routes,Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import RegisterForm from "./Components/RegisterForm";
import LoginForm from "./Components/LoginForm";
import Dashboard from "./Components/Dashboard";
import { Container } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useReducer } from "react";
import usersReducer from "./Reducers/usersReducer";
import filesReducer from "./Reducers/filesReducer";
import selectedFilesReducer from "./Reducers/sharedFilesReducer";
import { UsersContext } from "./ContextApi/usersContext";
import { FilesContext } from "./ContextApi/filesContext";
import { SharedFilesContext } from "./ContextApi/sharedFilesContext";
import axios from "axios";


function App() {
  const [users, usersDispatch] = useReducer(usersReducer,null)

  useEffect(()=>{
    (async function(){
      try { 
        const token = localStorage.getItem('token')
        if(token && !users) {
          const userResponse = await axios.get('http://localhost:3001/api/users/account',{
          headers: {
           Authorization: token
          }
          })
          console.log(userResponse.data)
          usersDispatch({type: 'SET_USER',payload: userResponse.data})
        }
      } catch(err) {
        console.log(err)
      }
    })();
  },[users])

  return (
    <div>
      <UsersContext.Provider value={{users, usersDispatch}}>
      <NavBar/>
      <Container sx={{ paddingTop: '100px' }}>
      <Routes>
        <Route path="/" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
      </Container>
      </UsersContext.Provider>
    </div>
  );
}

export default App;
