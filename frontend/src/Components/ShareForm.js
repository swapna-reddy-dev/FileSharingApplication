import { Alert, Autocomplete, Box, Button, Divider, FormControl, FormHelperText, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {toast , ToastContainer} from 'react-toastify' 

export default function ShareFileForm({fileId,handleShareClose}) {
    const [shareData, setShareData] = useState({
        sharedWithUserId: '',
        accessExpiry: ''
    })
    const [users, setUsers] = useState([])
    const [clientErrors, setClientErrors] = useState({})
    const [serverErrors,setServerErrors] = useState('')
    const errors = {}

    console.log(shareData,'dsfas')
    useEffect(()=>{
        (async function(){
            try{
                const response = await axios.get('http://localhost:3001/api/users')
                console.log(response.data)
                setUsers(response.data)
            } catch(err){
                console.log(err)
            }
        })();
    },[])
    
    const handleEmailChange = (e,value) => {
        setShareData({...shareData, sharedWithUserId: value.map(ele => ele._id)})
    }

    const validations = () => {
        if (shareData.sharedWithUserId.length === 0) {
            errors.sharedWithUserId ='Please select at least one email'
        }
        if (shareData.accessExpiry && dayjs(shareData.accessExpiry).isBefore(dayjs(), 'day')) {
            errors.accessExpiry = ('Access expiry date cannot be before the current date');
        }
    
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        validations()
        if(!Object.keys(errors).length) {
            console.log(clientErrors,'ccc')
            let accessExpiryIso = null;
            if (shareData.accessExpiry) {
                const accessExpiryDate = dayjs(shareData.accessExpiry);
                accessExpiryIso = accessExpiryDate.isValid() ? accessExpiryDate.toISOString() : null;
            }
            console.log(accessExpiryIso,'f')
            const formData = {
                fileId,
                sharedWithUserId: shareData.sharedWithUserId,
                accessExpiry: accessExpiryIso
            };
            try {
                setClientErrors({})
                const token = localStorage.getItem('token')
                const response = await axios.post('http://localhost:3001/api/files/share',formData,{
                    headers: {
                        Authorization: token
                    }
                })
                console.log(response.data)
                
                setShareData({sharedWithUserId: '', accessExpiry: ''})
                                
                toast.success("Successfully Shared!",{
                    autoClose:1000,
                    onClose:()=>handleShareClose()
                  });
                setServerErrors('')
                
    
            } catch(err) {
                console.log(err)
                setServerErrors('Something went wrong! Please check your Internet')
            }
        } else {
            console.log(clientErrors,'rrrr')
            setClientErrors(errors)
        }
    }
    
    return (
        <Box p={3} borderRadius={2} boxShadow={3} bgcolor="background.paper" width={400}>
            <ToastContainer position='top-center'/>
            <Typography variant="h6" textAlign='center' fontWeight='bold' sx={{marginBottom: '10px'}}>
                Share File
            </Typography>
            {serverErrors && (
                <Alert
                severity="error"
                style={{ position: "sticky", marginBottom: "20px" }}
             >
                {serverErrors}
            </Alert>
            )}
            <Divider sx={{  backgroundColor: '#A00DB8', height: 3, marginBottom: '25px'}} />
            <form onSubmit={handleSubmit}>
            <Stack direction="column" alignContent="center" spacing={2}>
            <Autocomplete
                multiple
                options={users}
                getOptionLabel={(option) => option.email} 
                onChange={handleEmailChange}
                renderInput={(params) => 
                <TextField {...params} 
                label="Select User Email" 
                variant="outlined"
                error={clientErrors.sharedWithUserId ? true : false}
                helperText={
                    clientErrors.sharedWithUserId ? (
                        <span style={{ color: "red" }}>{clientErrors.sharedWithUserId}</span>
                    ) : null
                }
                 />}
                sx={{ marginBottom: '16px' }}
            />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl fullWidth error={!!clientErrors.accessExpiry}>
        <DateTimePicker
            label="Access Expiry Date & Time"
            value={shareData.accessExpiry ? dayjs(shareData.accessExpiry) : null}
            onChange={(newValue) => setShareData({ ...shareData, accessExpiry: newValue })}
            sx={{ marginBottom: '16px' }}
        />
        {clientErrors.accessExpiry && (
            <FormHelperText style={{ color: 'red' }}>{clientErrors.accessExpiry}</FormHelperText>
        )}
    </FormControl>

    </LocalizationProvider>
        </Stack>
        <Box display="flex" justifyContent="flex-end">
        <Button onClick={handleShareClose} sx={{ marginRight: 1 }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Share
        </Button>
      </Box>
            </form>
    </Box>
    )
}