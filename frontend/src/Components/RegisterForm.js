import { Box, Grid, Typography, Divider, Stack, TextField, Button, Alert } from "@mui/material";
import { useState } from "react";
import {toast , ToastContainer} from 'react-toastify' 
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

export default function RegisterForm() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [serverErrors, setServerErrors] = useState('')
    const [clientErrors, setClientErrors] = useState({})
    const errors = {}


    const handleChange = (e) => {
        const {name, value} = e.target
        setForm({...form, [name]: value})
    }

    //validations
    const validations = () => {
        if(!form.username.trim()) {
            errors.username = 'UserName is required'
        }
        if(!form.email.trim()) {
            errors.email = 'Email is required'
        } else if(!/\S+@\S+\.\S+/.test(form.email)) {
            errors.email = 'Email must be valid'
        }
        if(!form.password.trim()) {
            errors.password = 'Password is required'
        } else if(!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(form.password)) {
            errors.password = 'Please create a strong password'
        }
        if(!form.confirmPassword.trim()) {
            errors.confirmPassword = 'Password confirmation is required'
        } else if(form.confirmPassword !== form.password) {
            errors.confirmPassword = 'Must match the password'
        }
    }

    //submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        validations()
        if(!Object.keys(errors).length) {
            try{
                const formData = {
                    username: form.username,
                    email: form.email,
                    password: form.password
                }
                setClientErrors({})
                const response = await axios.post('http://localhost:3001/api/users/register',formData)
                console.log(response.data)
                setForm({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                })
                toast.success("Successfully Registered!",{
                    autoClose:1000,
                    onClose:()=>navigate('/')
                  });
                  setServerErrors('')
            } catch(err) {
                console.log(err)
                setServerErrors('Please ensure all the fields are filled properly! Server Error Encountered')
            }
        } else {
            console.log('err',errors)
            setClientErrors(errors)
        }
    }

    return (
        <Grid container justifyContent="center" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <ToastContainer position="top-center"/>
            <Grid item xs={12} sm={8} md={6}>
            <Box p={4} boxShadow={3} bgcolor="background.paper" borderRadius={2}>
            
            <Typography variant="h5" align="center" fontWeight='bold' gutterBottom>
                Registeration Form
            </Typography>
            {serverErrors && (
                <Alert
                severity="error"
                style={{ position: "sticky", marginBottom: "20px" }}
             >
                {serverErrors}
            </Alert>
            )}
            <Box sx={{padding: '10px'}}>
            <Divider sx={{  backgroundColor: '#A00DB8', height: 3, marginBottom: '25px'}} />
            <form onSubmit={handleSubmit}>
                <Stack direction="column" alignContent="center" spacing={2}>
                <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    label="Username"
                    size="small"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    error={clientErrors.username}
                    helperText={
                        clientErrors.username ? (
                          <span style={{ color: "red" }}>{clientErrors.username}</span>
                        ) : null
                      }
                />
                <TextField
                    fullWidth
                    type="email"
                    variant="outlined"
                    label="Email"
                    size="small"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
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
                    value={form.password}
                    onChange={handleChange}
                    error={clientErrors.password}
                    helperText={
                        clientErrors.password ? (
                          <span style={{ color: "red" }}>{clientErrors.password}</span>
                        ) : null
                      }
                />
                <TextField
                    fullWidth
                    type="password"
                    variant="outlined"
                    label="Confirm Password"
                    size="small"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    error={clientErrors.confirmPassword}
                    helperText={
                        clientErrors.confirmPassword ? (
                          <span style={{ color: "red" }}>{clientErrors.confirmPassword}</span>
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
                    Register
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
            Already have an account? <Link to={"/"}>Click here</Link>
          </Typography>
            </Box>
            </Box>
            </Grid>
        </Grid>
    )
}