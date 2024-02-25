import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <Typography variant="h3" color="green">
        Login Successful!
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => {
          navigate('/');
        }}
      >
        Logout
      </Button>
    </>
  );
}

export default HomePage;
