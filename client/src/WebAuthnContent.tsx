import { useState, useEffect } from 'react';
import { Stack, TextField, Button, Box, Typography } from '@mui/material';
import WebAuthnClient from './webAuthnClient';
import { fetchChallenge } from './service/challenge';

export default function WebAuthnContext() {
  const [name, setName] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  const [credentialIds, setCredentialIds] = useState<string[]>([]);

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

  async function register() {
    try {
      const challenge = (await fetchChallenge()).data.data.challenge as string;
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
      if (credentials) {
        setCredentialIds([credentials.id]);
      }
      setName(() => '');
    } catch (error) {
      console.error(error);
    }
  }

  async function authenticating() {
    try {
      const challenge = (await fetchChallenge()).data.data.challenge as string;
      const assertion = await WebAuthnClient.authenticate(
        credentialIds,
        challenge,
        {
          transport: ['internal']
        }
      );
      console.log(assertion);
      setName(() => '');
    } catch (error) {
      console.error(error);
    }
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
            }}
          >
            Register
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={async () => {
              await authenticating();
            }}
          >
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
