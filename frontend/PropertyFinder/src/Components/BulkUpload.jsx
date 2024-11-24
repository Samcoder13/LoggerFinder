import { useState } from 'react';
import { Box, Typography, Container, CssBaseline, TextField, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideNavbar from "./SideNavbar";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Input = styled('input')({
  display: 'none',
});

const OuterDiv = styled('div')({
  background: '#f9f1f1',
  minHeight: '50vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  position: 'relative',
  top: 0,
  borderRadius: '16px',
  transition: 'background-color 0.3s ease',
  width: '130%', // Set the width to 130% of the container
  margin: '0 auto', // Center the div horizontally
  border: '4px dotted #337ab7',
  '&:hover': {
    backgroundColor: '#e0dcdc',
  },
});

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('No file selected!');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:4000/v1/uploadfile', {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });
      if (response.status === 403) {
        localStorage.clear();
        navigate("/");
      }
      const data=await response.json();
      if (response.ok) {
        toast.success('File uploaded successfully!');
        navigate('/list');
      } else {
        toast.error('Error uploading file!');
        console.error('Error uploading file:', response.status);
      }
    } catch (error) {
      toast.error('Error uploading file!');
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OuterDiv>
      <CssBaseline />
      <SideNavbar />
      <Container component="main" maxWidth="md">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontSize: '24px' }}>
            Click Select File to upload, it only accepts csv file
          </Typography>
          <label htmlFor="file-upload">
            <Input id="file-upload" type="file" onChange={handleFileChange} accept=".csv" />
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 3, borderColor: '#337ab7', color: '#337ab7' }}
            >
              Select File
            </Button>
          </label>
          {file && (
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              disabled
              value={file.name}
              sx={{
                mt: 3,
                '& .MuiOutlinedInput-root': {
                  fontWeight: 'bold',
                  color: '#337ab7',
                  borderColor: '#337ab7',
                  '&.Mui-disabled': {
                    '-webkit-text-fill-color': '#337ab7',
                  },
                  '& fieldset': {
                    borderColor: '#337ab7',
                  },
                },
              }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 3, bgcolor: '#337ab7' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
          </Button>
        </Box>
      </Container>
      <ToastContainer />
    </OuterDiv>
  );
};

export default BulkUpload;
