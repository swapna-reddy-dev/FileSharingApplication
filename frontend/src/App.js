import { Routes,Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import RegisterForm from "./Components/RegisterForm";
import LoginForm from "./Components/LoginForm";
import Dashboard from "./Components/Dashboard";
import ViewSharedFile from "./Components/ViewSharedFile";
import ViewMyFile from "./Components/ViewMyFile";
import VerifyToView from "./Components/VerifyToView";
import PrivateRoutes from "./Components/PrivateRoutes";
import { Container } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useReducer } from "react";
import usersReducer from "./Reducers/usersReducer";
import filesReducer from "./Reducers/filesReducer";
import sharedFilesReducer from "./Reducers/sharedFilesReducer";
import { UsersContext } from "./ContextApi/usersContext";
import { FilesContext } from "./ContextApi/filesContext";
import { SharedFilesContext } from "./ContextApi/sharedFilesContext";
import axios from "axios";


const filesInitialState = {
  data: [],
  serverErrors: null
}

const sharedFilesInitialState = {
  data: [],
  serverErrors: null
}

function App() {
  const [users, usersDispatch] = useReducer(usersReducer,null)
  const [files, filesDispatch] = useReducer(filesReducer,filesInitialState)
  const [sharedFiles, sharedFilesDispatch] = useReducer(sharedFilesReducer,sharedFilesInitialState)

  useEffect(()=>{
    (async function(){
      try { 
        const token = localStorage.getItem('token')
        const header = {
          headers: {
              Authorization: token
          }
      }
        if(token && !users) {
          const userResponse = await axios.get('http://localhost:3001/api/users/account',header)
          usersDispatch({type: 'SET_USER',payload: userResponse.data})
        }
        if(token && users) {
          try {
            const fileResponse = await axios.get('http://localhost:3001/api/files/myFiles',header)
            //console.log(fileResponse.data)
            filesDispatch({type: 'SET_FILES',payload: fileResponse.data})
        } catch(err) {
            console.log(err)
            filesDispatch({type: 'SET_SERVER_ERRORS', payload: 'Something went wrong, Server Error encountered!'})
        }
        try {
          const sharedFileResponse = await axios.get('http://localhost:3001/api/files/sharedFiles',header)
          //console.log(sharedFileResponse.data)
          sharedFilesDispatch({type: 'SET_SHARED_FILES',payload: sharedFileResponse.data})
      } catch(err) {
          console.log(err)
          sharedFilesDispatch({type: 'SET_SERVER_ERRORS', payload: 'Something went wrong, Server Error encountered!'})
      }
        }
      } catch(err) {
        console.log(err)
      }
    })();
  },[users])

  return (
    <div>
      <UsersContext.Provider value={{users, usersDispatch}}>
      <FilesContext.Provider value={{files, filesDispatch}}>
      <SharedFilesContext.Provider value={{sharedFiles, sharedFilesDispatch}}>
      <NavBar/>
      <Container sx={{ paddingTop: '100px' }}>
      <Routes>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/" element={<PrivateRoutes>
          <Dashboard/>
        </PrivateRoutes>}/>
        <Route path="/view-shared-file/:id" element={<PrivateRoutes>
          <ViewSharedFile/>
        </PrivateRoutes>}/>
        <Route path="/view-my-file/:id" element={<PrivateRoutes>
          <ViewMyFile/>
        </PrivateRoutes>}/>
        <Route path="verify-to-view/:id" element={<VerifyToView/>}/>
      </Routes>
      </Container>
      </SharedFilesContext.Provider>
      </FilesContext.Provider>
      </UsersContext.Provider>
    </div>
  );
}

export default App;
