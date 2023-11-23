import { useState, useEffect } from 'react';
import { Stack, TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import WebAuthnClient, {
  PublicKeyOptions,
  PublicKeyCredentialAttestationAdapter,
  PublicKeyCredentialAssertionAdapter
} from './webAuthnClient';
import { fetchRegisterOptions, postRegister } from './service/register';
import { postAuthOptions, postAuthSignature } from './service/authentication';
import { Base64Url } from './utils';

export default function WebAuthnContext() {
  const [name, setName] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const navigator = useNavigate();

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
      const {
        data: {
          data: {
            options: { challenge, rpId, rpName, excludeCredentials }
          }
        }
      } = await fetchRegisterOptions(name);
      const publicKeyOptions = new PublicKeyOptions(
        challenge,
        {
          id: crypto.getRandomValues(new Uint8Array(32)),
          name: name,
          displayName: name
        },
        rpId,
        rpName,
        {
          userVerification: 'required',
          attestation: 'direct',
          authenticatorAttachment: 'platform',
          excludeCredentials: excludeCredentials.map(({ id, ...args }) => {
            return {
              id: Base64Url.decodeBase64Url(id),
              ...args
            };
          })
        }
      ).publicKeyOptions;
      const credentials =
        await WebAuthnClient.createPublicKey(publicKeyOptions);
      console.log(credentials);
      if (credentials) {
        await postRegister(
          new PublicKeyCredentialAttestationAdapter(credentials, name).toJson()
        );
      }
      setName(() => '');
    } catch (error) {
      console.error(error);
    }
  }

  async function authenticating() {
    try {
      const options = await postAuthOptions({
        username: name,
        user_verification: 'required'
      });
      if (options) {
        const assertion = await WebAuthnClient.authenticate(
          [options.data.data.credential_id],
          options.data.data.challenge,
          {
            transport: ['internal']
          }
        );
        console.log(assertion);
        if (assertion) {
          const res = new PublicKeyCredentialAssertionAdapter(
            assertion
          ).toJson();
          const result = await postAuthSignature(res);
          if (result.data.data.token) {
            navigator('/home');
          }
        }
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
