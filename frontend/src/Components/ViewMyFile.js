import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FilesContext } from "../ContextApi/filesContext";
import axios from "axios";
import { format } from "date-fns"
import { Box, Stack } from "@mui/system"
import { Divider, Typography } from "@mui/material"

export default function ViewMyFile() {
    const {id} = useParams()
    const {files} = useContext(FilesContext)
    const [file, setFile] = useState(null)

    const myFile = files?.data?.find(ele => ele._id === id)
    console.log(myFile, 'myfile')

    useEffect(()=>{
        (async function(){
            try {
                const token = localStorage.getItem('token');
                if(myFile) {
                    const response = await axios.get(`http://localhost:3001/api/files/view/${id}`, {
                  headers: {
                    Authorization: token
                  },
                  responseType: 'arraybuffer' // Set response type to arraybuffer
                });
                console.log(response,'file')
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);                
                setFile(url);
                }
            } catch(err) {
                console.log(err)
            }
        })();
        // eslint-disable-next-line
    },[files.data])

    return (
        <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding="0"
        overflow="hidden"
    >
        <Box
            marginTop="50px"
            width="100%"
            height="100%"
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
        >
        {myFile && (
            <>
            <Box width={{ xs: '100%', md: '20%' }} padding="50px">
                <Typography
                    fontWeight='bold'
                    fontSize='30px'
                    textAlign='center'
                    sx={{
                        marginTop: '20px'
                    }}
                >
                File Details
                </Typography>
                <Divider sx={{  backgroundColor: '#A00DB8', height: 3, marginBottom: '25px'}} />
                <Stack spacing={3} direction='column'>
                <Typography
                    fontSize='16px'
                >
                <strong>File Name</strong>: {myFile.fileName}
                </Typography>
                <Typography
                    fontSize='16px'
                >
                <strong>File Size</strong>: {myFile.humanFileSize}
                </Typography>
                <Typography
                    fontSize='16px'
                >
                <strong>Access</strong>: {format(new Date(myFile.createdAt), 'PPPpp')}
                </Typography>
                <Typography
                    fontSize='16px'
                >
                <strong>File Shared With :</strong>
                </Typography>
                <ul>
                    {myFile.sharedWith.map(ele => {
                        return <li key={ele._id}>{ele.email}</li>
                    })}
                </ul>
                </Stack>
            </Box>
            <Box width={{ xs: '100%', md: '80%' }}>
            {file && (
                <embed src={file} type="application/pdf" width="100%" 
                 height='100%'
                style={{ border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' ,marginTop:'30px'}}/>
            )}
            </Box>
            </>
        )}            
      </Box>
     </Box>
    )
}