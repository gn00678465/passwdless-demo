import { useState, useEffect } from 'react';
import { Stack, TextField, Button, Box, Typography } from '@mui/material';
import WebAuthnClient, { PublicKeyCredentialModel } from './webAuthnClient';
import { fetchChallenge } from './service/challenge';
import { postRegister } from './service/register';
import { postAuthOptions } from './service/authentication';

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

  async function register() {
    try {
      const challenge = (await fetchChallenge()).data.data.challenge as string;
      const credentials = await WebAuthnClient.createPublicKey(
        challenge,
        {
          id: crypto.getRandomValues(new Uint8Array(32)),
          name: name,
          displayName: 'Lee'
        },
        {
          userVerification: 'required',
          attestation: 'direct',
          authenticatorAttachment: 'platform'
        }
      );
      if (credentials) {
        await postRegister(
          new PublicKeyCredentialModel(credentials, name).toJson()
        );
      }
      setName(() => '');
    } catch (error) {
      console.error(error);
    }
  }

  async function authenticating() {
    try {
      const challenge = (await fetchChallenge()).data.data.challenge as string;
      const options = await postAuthOptions({
        username: name,
        user_verification: 'required'
      });
      if (options) {
        const assertion = await WebAuthnClient.authenticate(
          [options.data.data.credential_id],
          challenge,
          {
            transport: ['internal']
          }
        );
        console.log(assertion);
      }
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
