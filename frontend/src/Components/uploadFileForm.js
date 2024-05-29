import { Box, Button, TextField, Typography } from '@mui/material';


export default function UploadFileForm({handleUploadClose,filesDispatch}) {
    return (
        <Box p={4}>
            <Typography variant="h6" textAlign='center' fontWeight='bold'>
            Upload File
        </Typography>
      <TextField
        label="File Name"
        variant="outlined"
        fullWidth
        // value={fileName}
        // onChange={handleFileNameChange}
        sx={{ marginBottom: '16px' }}
      />
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        //onChange={handleFileChange}
      />
      <Box mt={2} textAlign="right">
        <Button onClick={handleUploadClose} sx={{ marginRight: 1 }}>
          Cancel
        </Button>
        <Button  variant="contained" color="primary">
          Upload
        </Button>
      </Box>
    </Box>
    )
}