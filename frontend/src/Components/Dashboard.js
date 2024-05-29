import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { FilesContext } from "../ContextApi/filesContext";
import { SharedFilesContext } from "../ContextApi/sharedFilesContext";
import { Container, Grid, Typography, MenuItem, Select, Box, Button,Dialog, DialogTitle, DialogContent, DialogActions, TextField  } from '@mui/material';
import AddSharpIcon from "@mui/icons-material/AddSharp";
import SendIcon from '@mui/icons-material/Send';
import UploadFileForm from "./uploadFileForm";


export default function Dashboard() {
    const {files , filesDispatch} = useContext(FilesContext)
    const {sharedFiles, sharedFilesDispatch} = useContext(SharedFilesContext)
    const [selectedOption, setSelectedOption] = useState('myfiles')
    const [loading, setLoading] = useState(false)
    const [openUpload, setOpenUpload] = useState(false)
    const [openShare, setOpenShare] = useState(false)

    const handleUploadOpen = () => {
        setOpenUpload(true)
    }

    const handleUploadClose = () => {
        setOpenUpload(false)
    }

    const handleShareOpen = () => {
        setOpenShare(true)
    }

    const handleShareClose = () => {
        setOpenShare(false)
    }
    useEffect(()=>{
        (async function(){
            const token = localStorage.getItem('token')
            const header = {
                headers: {
                    Authorization: token
                }
            }
            try {
                setLoading(true)
                const fileResponse = await axios.get('http://localhost:3001/api/files/myFiles',header)
                console.log(fileResponse.data)
                setLoading(false)
                filesDispatch({type: 'SET_FILES',payload: fileResponse.data})
            } catch(err) {
                console.log(err)
                filesDispatch({type: 'SET_SERVER_ERRORS', payload: 'Something went wrong, Server Error encountered!'})
            }
            try {
                setLoading(true)
                const sharedFileResponse = await axios.get('http://localhost:3001/api/files/sharedFiles',header)
                console.log(sharedFileResponse.data)
                setLoading(false)
                sharedFilesDispatch({type: 'SET_SHARED_FILES',payload: sharedFileResponse.data})
            } catch(err) {
                console.log(err)
                sharedFilesDispatch({type: 'SET_SERVER_ERRORS', payload: 'Something went wrong, Server Error encountered!'})
            }
        })();
        // eslint-disable-next-line
    },[])

    return (
<Container maxWidth="lg" sx={{ marginTop: '20px' }}>
    {files.data.length && (
        <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold">
            {selectedOption === 'myfiles' ? `My Files ${files.data.length}` : `Files Shared with me ${sharedFiles.data.length}`}
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Select
            size="small"
            value={selectedOption}
            onChange={(e)=>{setSelectedOption(e.target.value)}}
            displayEmpty
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="myfiles">My Files</MenuItem>
            <MenuItem value="sharedfiles">Shared Files</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sx={{  marginTop: '5px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadOpen}
            fullWidth
            startIcon={<AddSharpIcon />}
            sx={{
              backgroundColor: "#A00DB8",
              '&:hover': {
                backgroundColor: "#A00DB8", // same color as the normal state
              },
            }}
          >
            Upload Files
          </Button>
        </Grid>
      </Grid>
      )}

      <Box mt={4}>
        {loading ? (
          <Typography variant="h6" align="center">Loading...</Typography>
        ) : (
          <Grid container spacing={2}>
            {selectedOption === 'myfiles' ? 
                files.data.length ? 
            (
                files.data.map((file) => (
                    <Grid item xs={12} key={file._id}>
                      <Box
                  p={2}
                  boxShadow={2}
                  borderRadius={2}
                  bgcolor="background.paper"
                  display="flex"
                  alignItems="center"
                >
                  <Box flexGrow={1}>
                    <Typography variant="body1">{file.fileName}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {file.humanFileSize} 
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleShareOpen}
                    startIcon={<SendIcon/>}
                    sx={{
                      backgroundColor: "#A00DB8",
                      '&:hover': {
                        backgroundColor: "#A00DB8", // same color as the normal state
                      },
                    }}
                  >
                    Share
                  </Button>
                </Box>
                    </Grid>
                  ))
            ): "No files" :  sharedFiles.data.length ? (
                sharedFiles.data.map((file) => (
                    <Grid item xs={12} key={file._id}>
                      <Box
                        p={2}
                        boxShadow={2}
                        borderRadius={2}
                        bgcolor="background.paper"
                        display="flex"
                        alignItems="center"
                    >
                    <Box flexGrow={1}>
                        <Typography variant="body1">{file.fileId.fileName}</Typography>
                        <Typography variant="body2" color="textSecondary">
                        {file.fileId.humanFileSize} 
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SendIcon/>}
                        //onClick={() => handleShare(file)}
                        sx={{
                        backgroundColor: "#A00DB8",
                        '&:hover': {
                            backgroundColor: "#A00DB8", // same color as the normal state
                        },
                        }}
                    >
                        View
                    </Button>
                    </Box>
                    </Grid>
                  ))
            ) : "No shared files"}
            {}
          </Grid>
        )}
      </Box>

         {/*for uploading the files */}
      <Dialog open={openUpload} onClose={handleUploadClose}>
        <UploadFileForm handleUploadClose={handleUploadClose} filesDispatch={filesDispatch}/>
      </Dialog>
    </Container>
    )
}