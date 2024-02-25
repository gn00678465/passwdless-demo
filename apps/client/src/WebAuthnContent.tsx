import { useState, useEffect } from 'react';
import {
  Stack,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  FormControlLabel,
  Switch,
  Collapse
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { of, switchMap } from 'rxjs';
import { AxiosError } from 'axios';

import WebAuthnClient, {
  PublicKeyOptions,
  PublicKeyCredentialAttestationAdapter,
  PublicKeyCredentialAssertionAdapter,
  PublicKeyRequestOptions
} from './webAuthnClient';
import { fetchRegisterOptions, postRegister } from './service/register';
import {
  fetchAuthenticationOptions,
  postAuthSignature
} from './service/authentication';
import { Base64Url } from './utils';
import AdvanceContext from './AdvanceContent';

export default function WebAuthnContext() {
  const [name, setName] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showAdv, setShowAdv] = useState(true);
  const [attachment, setAttachment] =
    useState<WebAuthnClientType.Attachment>(undefined);

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
          data: { challenge, rpId, rpName, excludeCredentials }
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
          authenticatorAttachment: attachment,
          excludeCredentials: excludeCredentials.map(({ id, ...args }) => {
            return {
              id: Base64Url.decodeBase64Url(id),
              ...args
            } as PublicKeyCredentialDescriptor;
          })
        }
      ).publicKeyOptions;
      const credentials =
        await WebAuthnClient.createPublicKey(publicKeyOptions);
      console.log(credentials);
      if (credentials) {
        await postRegister(
          name,
          new PublicKeyCredentialAttestationAdapter(credentials).toJson()
        );
      }
      setError(() => '');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'InvalidStateError') {
          console.error('InvalidStateError', error.name);
          setError(() => '此裝置已註冊過');
        }
        if (error.name === 'NotAllowedError') {
          console.error('NotAllowedError', error.name);
          setError(() => '使用者已取消作業');
        }
        console.error(error);
      }
    } finally {
      setName(() => '');
    }
  }

  async function authenticating() {
    of(name)
      .pipe(
        switchMap((name) =>
          fetchAuthenticationOptions(name).then((res) => res.data.data)
        ),
        switchMap(
          async (options) =>
            new PublicKeyRequestOptions(options.challenge, {
              allowCredentials: options.allowCredentials.map(
                ({ id, ...args }) => {
                  return {
                    id: Base64Url.decodeBase64Url(id),
                    ...args
                  } as PublicKeyCredentialDescriptor;
                }
              )
            }).publicKeyRequestOptions
        ),
        switchMap((assertOpts) => WebAuthnClient.authenticate(assertOpts)),
        switchMap((assert) => {
          console.log(assert);
          if (assert) {
            return postAuthSignature(
              name,
              new PublicKeyCredentialAssertionAdapter(assert).toJson()
            );
          }
          throw new Error('認證錯誤');
        })
      )
      .subscribe({
        next: (success) => {
          if (success.status === 200 && success.data.status === 'Success') {
            navigate('/home');
          }
        },
        error(error: AxiosError<Error> | Error) {
          if (error instanceof Error) {
            if ('response' in error && 'data' in error.response!) {
              setError(() => error.response?.data.message ?? 'Unknown Error');
              return;
            }
            setError(() => error.message ?? 'Unknown Error');
          }
          console.log('error', error);
        },
        complete() {
          setName(() => '');
        }
      });
  }

  function handleChange(
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) {
    setShowAdv(checked);
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
      {error && (
        <Alert variant="filled" severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
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
      <Box sx={{ mt: 3, width: 400, textAlign: 'left' }}>
        <FormControlLabel
          control={<Switch checked={showAdv} onChange={handleChange} />}
          label="Advance"
        />
        <Collapse in={showAdv}>
          <AdvanceContext
            attachment={attachment}
            setAttachment={setAttachment}
          ></AdvanceContext>
        </Collapse>
      </Box>
    </Box>
  );
}
