import { useState, useEffect } from 'react';
import { Stack, TextField, Button, Box, Typography } from '@mui/material';
import WebAuthnClient from './webAuthnClient';

export default function WebAuthnContext() {
  const [name, setName] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  useEffect(() => {
    async function getAvailable(): Promise<void> {
      try {
        const res =
          WebAuthnClient.isAvailable() &&
          (await WebAuthnClient.isLocalAuthenticator());
        setIsAvailable(res);
      } catch (err) {
        setIsAvailable(false);
      }
    }

    getAvailable();
  }, []);

  const challenge = 'a7c61ef9-dc23-4806-b486-2428938a547e';

  async function register() {
    const credentials = await WebAuthnClient.createPublicKey(
      challenge,
      {
        id: Uint8Array.from('UZSL85T9AFC', (c) => c.charCodeAt(0)),
        name: name,
        displayName: 'Lee'
      },
      {
        userVerification: 'required',
        attestation: 'direct',
        authenticatorAttachment: 'platform'
      }
    );
    console.log(credentials);
  }

  return (
    <Box width={400} sx={{ display: 'inline-block' }}>
      <TextField
        label="Name"
        variant="filled"
        size="small"
        fullWidth
        value={name}
        sx={{ mt: 3 }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setName(event.target.value);
        }}
      />

      {isAvailable ? (
        <Stack
          direction="row"
          spacing={3}
          useFlexGap
          sx={{ mt: 3 }}
          justifyContent="center"
        >
          <Button
            variant="contained"
            fullWidth
            onClick={async () => {
              if (name === '') return;
              await register();
              setName(() => '');
            }}
          >
            Register
          </Button>
          <Button variant="contained" fullWidth>
            Authenticate
          </Button>
        </Stack>
      ) : (
        <Typography variant="h4" color="red" sx={{ mt: 3 }}>
          瀏覽器不支援 WebAuthn
        </Typography>
      )}
    </Box>
  );
}
