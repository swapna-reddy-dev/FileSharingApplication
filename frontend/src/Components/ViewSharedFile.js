import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { format, formatDistanceToNow, isPast} from "date-fns"
import axios from "axios"
import { Box, Stack } from "@mui/system"
import { Divider, Typography } from "@mui/material"

export default function ViewSharedFile() {
    const {id} = useParams()
    const [file, setFile] = useState(null)
    const [sharedFile, setSharedFile] = useState(null)
    const [accessExpired, setAccessExpired] = useState(false)

    useEffect(()=>{
        (async function(){
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/api/files/oneFile/${id}`, {
                  headers: {
                    Authorization: token
                  }
                })
                console.log(response.data,'shared file')
                setSharedFile(response.data)

                if (response.data.accessExpiry && isPast(new Date(response.data.accessExpiry))) {
                    setAccessExpired(true);
                }


            } catch(err) {
                console.log(err)
            }
        })();
        // eslint-disable-next-line
    },[])
    
    useEffect(()=>{
        (async function(){
            try {
                const token = localStorage.getItem('token');
                if(sharedFile && !accessExpired) {
                    const response = await axios.get(`http://localhost:3001/api/files/view/${sharedFile.fileId._id}`, {
                  headers: {
                    Authorization: token
                  },
                  responseType: 'arraybuffer' // Set response type to arraybuffer
                });
                console.log(response,'dskj')
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);                
                setFile(url);
                }
            } catch(err) {
                console.log(err)
            }
        })();
    },[sharedFile,accessExpired])

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
        {sharedFile && (
            <>
            <Box width={{ xs: '100%', md: '20%' }} padding="50px" sx={{borderRight: '2px solid purple'}}>
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
                    //textAlign='center'
                >
                <strong>File Owner</strong>: {sharedFile.fileId.owner.username}
                </Typography>
                <Typography
                    fontSize='16px'
                >
                <strong>Email</strong>: {sharedFile.fileId.owner.email}
                </Typography>
                <Typography
                    fontSize='16px'
                >
                <strong>File Name</strong>: {sharedFile.fileId.fileName}
                </Typography>
                <Typography
                    fontSize='16px'
                >
                <strong>File Size</strong>: {sharedFile.fileId.humanFileSize}
                </Typography>
                <Typography
                    fontSize='16px'
                >
                <strong>Access</strong>: {sharedFile.accessExpiry ? format(new Date(sharedFile.accessExpiry), 'PPPpp') : 'You do not have time limitations to access the file'}
                </Typography>
                {sharedFile.accessExpiry && (
                    <Typography
                    fontSize='16px'
                >
                {accessExpired ? (<strong>Expired:</strong>) : (<strong>Time Left:</strong> )}
                {formatDistanceToNow(new Date(sharedFile.accessExpiry), { addSuffix: true })}
                </Typography>
                )}
                </Stack>
            </Box>
            <Box width={{ xs: '100%', md: '80%' }}>
                {accessExpired ? (
                    <Box>
                        <Typography
                        fontWeight='bold'
                        fontSize='20px'
                        textAlign='center'
                        sx={{
                            marginTop: '100px',
                            marginBottom: '100px'
                        }}
                    >
                        Your time limit to access this file has <span style={{color: 'red'}}>expired</span>!. Please contact the owner of the file to gain access again.
                    </Typography>
                    <Box
                        component="img"
                        style={{
                        display: "block",
                        margin: "auto",
                        height: "300px",
                        width: "300px",
                        maxWidth: "100%",
                        borderRadius: "50%",
                        objectFit: "fill",
                        }}
                        src="/limitover.jpg"
                        alt="Image"
                    />
                    </Box>
                    
                            ) : (
                                file && (
                                    <embed src={file} type="application/pdf" width="100%" 
                                     height='100%' 
                                    style={{ border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', marginTop: '30px' }} />
                                )
                            )}
            </Box>
            </>
        )}      
      </Box>
     </Box>
    )
}