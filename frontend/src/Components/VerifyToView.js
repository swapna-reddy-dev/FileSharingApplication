import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Box, Stack, Skeleton } from '@mui/material';
import { UsersContext } from '../ContextApi/usersContext';

export default function VerifyToView() {
    const navigate = useNavigate()
    const {users} = useContext(UsersContext)
    const {id} = useParams()
    
    console.log(id,'fileif')
    const loginToken = localStorage.getItem('token')

    useEffect(()=>{
        if(!users && !loginToken) {
            navigate(`/login`, {state: {id}})
        } else if(loginToken) {
            navigate(`/view-shared-file/${id}`)
            console.log('inside',users)
        }
          // eslint-disable-next-line
    },[users])

    return (
        <Box
         sx={{
            marginTop: '80px',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '75%'
         }}
        >
            <Stack spacing={1}>
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="rectangular" width="100%" height="450px"  />
            <Skeleton variant="rectangular" width="100%"height={80} />
            <Skeleton variant="rounded" width="100%" height={80} />
            </Stack>
        </Box>
    )
}