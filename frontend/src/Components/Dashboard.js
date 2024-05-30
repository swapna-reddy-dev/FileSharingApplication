import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { FilesContext } from "../ContextApi/filesContext";
import { SharedFilesContext } from "../ContextApi/sharedFilesContext";
import { Container, Grid, Typography, MenuItem, Select, Box, Button,Dialog } from '@mui/material';
import AddSharpIcon from "@mui/icons-material/AddSharp";
import SendIcon from '@mui/icons-material/Send';
import UploadFileForm from "./uploadFileForm";
import ShareFileForm from "./ShareForm";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, isPast } from 'date-fns';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';



export default function Dashboard() {
    const {files , filesDispatch} = useContext(FilesContext)
    const {sharedFiles, sharedFilesDispatch} = useContext(SharedFilesContext)
    const [selectedOption, setSelectedOption] = useState('myfiles')
    const [loading, setLoading] = useState(false)
    const [openUpload, setOpenUpload] = useState(false)
    const [openShare, setOpenShare] = useState(false)
    const [fileId, setFileId] = useState('')

    const navigate = useNavigate()

    const handleUploadOpen = () => {
        setOpenUpload(true)
    }

    const handleUploadClose = () => {
        setOpenUpload(false)
    }

    const handleShareOpen = (id) => {
        setFileId(id)
        setOpenShare(true)
    }

    const handleShareClose = () => {
        setOpenShare(false)
    }
    
    const handleView = (id) => {
      navigate(`/view-shared-file/${id}`)
    }

    const handleFileView = (id) => {
      navigate(`/view-my-file/${id}`)
    }

    const handleSelect = async (e) => {
      setSelectedOption(e.target.value)
      if(e.target.value === 'sharedfiles') {
        try {
          setLoading(true)
          const sharedFileResponse = await axios.get('http://localhost:3001/api/files/sharedFiles',{
            headers: {
              Authorization: localStorage.getItem('token')
            }
          })
          console.log(sharedFileResponse.data)
          setLoading(false)
          sharedFilesDispatch({type: 'SET_SHARED_FILES',payload: sharedFileResponse.data})
      } catch(err) {
          console.log(err)
          sharedFilesDispatch({type: 'SET_SERVER_ERRORS', payload: 'Something went wrong, Server Error encountered!'})
      }
      }
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
        })();
        // eslint-disable-next-line
    },[])

    return (
<Container maxWidth="lg" sx={{ marginTop: '20px' }}>
    {/* {files.data.length && ( */}
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
            onChange={handleSelect}
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
      {/* )} */}

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
                    onClick={()=>{handleShareOpen(file._id)}}
                    startIcon={<SendIcon/>}
                    sx={{
                      backgroundColor: "#A00DB8",
                      '&:hover': {
                        backgroundColor: "#A00DB8", // same color as the normal state
                      },
                      marginRight: '10px'
                    }}
                  >
                    Share
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={()=>{handleFileView(file._id)}}
                    startIcon={<RemoveRedEyeIcon/>}
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
            ): (
              <Box
              sx={{
                marginTop: "10px",
                marginLeft: "auto",
                marginRight: 'auto',
                justifyContent: "center",
                bgcolor: "background.paper",
                border: "2px ",
                p: 4,
                width: "40%",
                borderRadius: "10px",
                position: "relative",
              }}
              >
                
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
                src="/NoData.jpg"
                alt="Image"
            />
            <Typography
              variant="body1"
              fontWeight="bold"
              textAlign="center"
              fontSize="20px"
              //margin="50px"
            >You Do not have any files yet. Upload one now!</Typography>
              </Box>
              
            ) :  sharedFiles.data.length ? (
                sharedFiles.data.map((file) => {
                  
                  const accessExpiry = new Date(file.accessExpiry);
                  const hasExpired = file.accessExpiry ? isPast(accessExpiry) : false;
                  const timeLeft = !hasExpired ? formatDistanceToNow(accessExpiry, { addSuffix: true }) : null;
                    return (<Grid item xs={12} key={file._id}>
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
                        {file.accessExpiry && (
                          <Typography variant="body2" color={hasExpired ? "error" : "red"}>
                            {hasExpired ? "Access expired" : `Expires ${timeLeft}`}
                          </Typography>
                        )}
                    </Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<RemoveRedEyeIcon/>}
                        onClick={()=>{handleView(file._id)}}
                        disabled={hasExpired}
                        sx={{
                          backgroundColor: hasExpired ? "#CCCCCC" : "#A00DB8", // gray if expired
                          '&:hover': {
                            backgroundColor: hasExpired ? "#CCCCCC" : "#A00DB8", // same color as the normal state
                          },
                        }}
                      >
                        View
                    </Button>
                    </Box>
                    </Grid>)
                  })
            ) : (
              <Box
              sx={{
                marginTop: "10px",
                marginLeft: "auto",
                marginRight: 'auto',
                justifyContent: "center",
                bgcolor: "background.paper",
                border: "2px ",
                p: 4,
                width: "40%",
                borderRadius: "10px",
                position: "relative",
              }}
              >
                
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
                src="/NoData.jpg"
                alt="Image"
            />
            <Typography
              variant="body1"
              fontWeight="bold"
              textAlign="center"
              fontSize="20px"
            >You Do not have any files that were shared with you!</Typography>
              </Box>
            )}
            {}
          </Grid>
        )}
      </Box>

         {/*for uploading the files */}
      <Dialog open={openUpload} onClose={handleUploadClose}>
        <UploadFileForm handleUploadClose={handleUploadClose} filesDispatch={filesDispatch}/>
      </Dialog>

      {/*for sharing the files */}
      <Dialog open={openShare} onClose={handleShareClose}>
        <ShareFileForm fileId={fileId} files={files} handleShareClose={handleShareClose} sharedFilesDispatch={sharedFilesDispatch}/>
      </Dialog>
    </Container>
    )
}