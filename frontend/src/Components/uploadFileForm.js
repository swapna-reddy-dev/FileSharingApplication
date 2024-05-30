import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from 'axios';
import {toast , ToastContainer} from 'react-toastify' 



export default function UploadFileForm({handleUploadClose,filesDispatch}) {
    const [upload, setUpload] = useState({
        fileName: '',
        file: ''
    })
    
    const handleChange = (e) => {
        const {name, value, files} = e.target
        if(name === 'file') {
            setUpload({...upload, [name]: files[0]})
        } else {
            setUpload({...upload, [name]: value})
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('fileName',upload.fileName)
        formData.append('file',upload.file)
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:3001/api/files/upload',formData,{
                headers: {
                    Authorization: token
                }
            })
            console.log(response.data)
            filesDispatch({type: 'ADD_FILE',payload: response.data})
            setUpload({fileName: '', file: ''})
            toast.success("Successfully Uploaded!",{
                autoClose:1000,
                onClose:()=>handleUploadClose()
              });
            

        } catch(err) {
            console.log(err)
        }

    }
    
    return (
        <Box p={3} borderRadius={2} boxShadow={3} bgcolor="background.paper" width={400}>
            <ToastContainer position='top-center'/>
            <Typography variant="h6" textAlign='center' fontWeight='bold' sx={{marginBottom: '10px'}}>
                Upload File
            </Typography>
            <Divider sx={{  backgroundColor: '#A00DB8', height: 3, marginBottom: '25px'}} />
            <form onSubmit={handleSubmit}>
            <Stack direction="column" alignContent="center" spacing={2}>
            <TextField
                type='text'
                label="File Name"
                name="fileName"
                variant="outlined"
                fullWidth
                value={upload.fileName}
                onChange={handleChange}
                sx={{ marginBottom: '16px' }}
            />
            
            <Box display="flex" alignItems="center" mb={2}>
            <input
            type="file"
            name='file'
            accept=".pdf"
            onChange={handleChange}
            style={{ display: 'none' }}
            id="file-upload"
            />
            <label htmlFor="file-upload">
            <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ marginRight: 2 }}
            >
            Choose File
          </Button>
        </label>
            {upload.file && (
            <Typography variant="body1">
                {upload.file.name}
            </Typography>
            )}
            </Box>
            </Stack>
            
            <Box mt={2} textAlign="right">
                <Button onClick={handleUploadClose} sx={{ marginRight: 1 }}>
                    Cancel
                </Button>
                <Button  
                    variant="contained" 
                    type="submit"
                    sx={{
                        backgroundColor: "#A00DB8",
                        '&:hover': {
                          backgroundColor: "#A00DB8",
                        },
                      }}
                >
                Upload
                </Button>
            </Box>
            </form>
    </Box>
    )
}