import { Box, Grid, Typography, Divider, Stack, TextField, Button, Alert } from "@mui/material";
import { useContext, useState } from "react";
import {toast , ToastContainer} from 'react-toastify' 
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'
import { UsersContext } from "../ContextApi/usersContext";

export default function LoginForm() {
    const navigate = useNavigate()
    const location = useLocation()
    const {usersDispatch} = useContext(UsersContext)

    //to redirect to success page 
    const fileId = location.state?.id

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [clientErrors, setClientErrors] = useState({})
    const [serverErrors, setServerErrors] = useState('')
    const errors = {}

    const validations = () => {
        if(!email.trim().length) {
            errors.email = 'Email is required'
        }
        if(!password.trim().length) {
            errors.password = 'Password is required'
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            email,
            password
        }
        validations()
        if(!Object.keys(errors).length){
            setClientErrors({})
            try {
                const response = await axios.post('http://localhost:3001/api/users/login',formData)
                console.log(response.data)
                const token = response.data.token
                localStorage.setItem('token',token)

                const userResponse = await axios.get('http://localhost:3001/api/users/account',{
                    headers: {
                        Authorization: token
                    }
                })
                usersDispatch({type: 'SET_USER',payload: userResponse.data})
                
                

                setEmail('')
                setPassword('')
                setServerErrors('')
                toast.success('Successfully Logged In!', {
                    autoClose: 500,
                    onClose: () => {
                        if(fileId) {
                          navigate(`/view-shared-file/${fileId}`)
                        } else {
                          navigate("/")
                        }
                    }
                  })
                
            } catch(err) {
                console.log(err)
                setServerErrors(err.response.data)
            }
        } else {
            setClientErrors(errors)
        }
    }
    return (
        <Grid container justifyContent="center" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <ToastContainer position="top-center"/>
            <Grid item xs={12} sm={8} md={6}>
            <Box p={4} boxShadow={3} bgcolor="background.paper" borderRadius={2}>
            
            <Typography variant="h5" align="center" fontWeight='bold' gutterBottom>
                Login Form
            </Typography>
            {serverErrors.errors && (
                <Alert
                severity="error"
                style={{ position: "sticky", marginBottom: "20px" }}
             >
                {serverErrors.errors}
            </Alert>
            )}
            <Box sx={{padding: '10px'}}>
            <Divider sx={{  backgroundColor: '#A00DB8', height: 3, marginBottom: '25px'}} />
            <form onSubmit={handleSubmit}>
                <Stack direction="column" alignContent="center" spacing={2}>
                <TextField
                    fullWidth
                    type="email"
                    variant="outlined"
                    label="Email"
                    size="small"
                    name="email"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    error={clientErrors.email}
                    helperText={
                        clientErrors.email ? (
                          <span style={{ color: "red" }}>{clientErrors.email}</span>
                        ) : null
                      }
                />
                <TextField
                    fullWidth
                    type="password"
                    variant="outlined"
                    label="Password"
                    size="small"
                    name="password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    error={clientErrors.password}
                    helperText={
                        clientErrors.password ? (
                          <span style={{ color: "red" }}>{clientErrors.password}</span>
                        ) : null
                      }
                />
                </Stack>
                <Grid item xs={12} container justifyContent="center">
                <Grid item xs={12} sm={8} md={6}>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{
                      marginTop: '20px',
                      backgroundColor: "#A00DB8",
                      '&:hover': {
                        backgroundColor: "#A00DB8", // same color as the normal state
                      },
                    }}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Grid container spacing={2} sx={{ marginTop: '20px', alignItems: 'center' }}>
            <Grid item xs={5}>
              <Divider sx={{ border: "2px solid #A00DB8" }} />
            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'center' }}>
              <Typography fontFamily="Prociono" fontSize="16px" sx={{ color: "#737373" }}>
                OR
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Divider sx={{ border: "2px solid #A00DB8" }} />
            </Grid>
          </Grid>
          <Typography
            fontFamily="Prociono"
            textAlign="center"
            fontSize="16px"
            sx={{ color: "black", marginTop: '20px' }}
          >
            Don't have an account? <Link to={"/register"}>Click here</Link>
          </Typography>
            </Box>
            </Box>
            </Grid>
        </Grid>
    )
}