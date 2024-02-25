import { Container, CssBaseline } from '@mui/material';
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <h1>Oops!</h1>
        <h2>404 </h2>
        <h4>Page Not Found!</h4>
      </Container>
    </>
  );
}
