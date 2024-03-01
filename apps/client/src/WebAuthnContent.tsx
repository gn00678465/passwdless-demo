import { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  FormControlLabel,
  Switch,
  Collapse,
  Card,
  CardContent
} from "@mui/material";
import { useNavigate, useLoaderData, Link } from "react-router-dom";
import { isLocalAuthenticator } from "@webauthn/browser";

import AdvanceContext from "./AdvanceContent";
import { useRegistration, usePassKeys, useAuthentication } from "./hooks";

export default function WebAuthnContext() {
  const [field, setField] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const navigate = useNavigate();
  const loaderData = useLoaderData() as "login" | "register";
  const [error, setError] = useState("");
  const [showAdv, setShowAdv] = useState(true);
  const [attachment, setAttachment] = useState<AuthenticatorAttachment | undefined>(undefined);

  useEffect(() => {
    async function getAvailable(): Promise<void> {
      try {
        const res = await isLocalAuthenticator();
        setIsAvailable(res);
      } catch (err) {
        setIsAvailable(false);
      }
    }

    getAvailable();
  }, []);

  const { registrationStart } = useRegistration<{ status: "Success" }>(field, {
    attachment,
    onSuccess: (args) => {
      setField(() => "");
      if (args?.status === "Success") {
        navigate("/home");
      }
    },
    onComplete() {
      setField(() => "");
    },
    onError(error) {
      if (error instanceof Error) {
        if (error.name === "InvalidStateError") {
          console.error("InvalidStateError", error.name);
          setError(() => "此裝置已註冊過");
        }
        if (error.name === "NotAllowedError") {
          console.error("NotAllowedError", error.name);
          setError(() => "使用者已取消作業");
        }
      }
      console.error(error);
    }
  });

  const { authenticationStart } = useAuthentication<{ status: "Success" }>(field, {
    attachment,
    onSuccess: (args) => {
      setField(() => "");
      if (args?.status === "Success") {
        navigate("/home");
      }
    },
    onComplete() {
      setField(() => "");
    },
    onError(error) {
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          console.error("NotAllowedError", error.name);
          setError(() => "使用者已取消作業");
        }
      }
      console.error(error);
    }
  });

  const { passkeysAuthStart } = usePassKeys<{ status: "Success" }>({
    attachment,
    onSuccess: (args) => {
      setField(() => "");
      if (args?.status === "Success") {
        navigate("/home");
      }
    },
    onComplete() {
      setField(() => "");
    },
    onError(error) {
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          console.error("NotAllowedError", error.name);
          setError(() => "使用者已取消作業");
        }
      }
      console.error(error);
    }
  });

  function handleChange(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    setShowAdv(checked);
  }

  function capitalizeCase(str: string): string {
    return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
  }

  return (
    <Box
      width={600}
      sx={{ display: "inline-block", bgColor: "#fff" }}
    >
      <Card
        variant="outlined"
        sx={{ borderRadius: 3, boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)" }}
      >
        <CardContent>
          <Typography
            variant="h4"
            mb={1}
            sx={{ fontWeight: 500 }}
          >
            {capitalizeCase(loaderData)}
          </Typography>
          {loaderData === "login" && (
            <Typography
              variant="h6"
              sx={{ fontWeight: 400 }}
            >
              No account yet?{" "}
              <Link
                to="/register"
                color="blue"
              >
                Sign up
              </Link>
            </Typography>
          )}
          {loaderData === "register" && (
            <Typography variant="h6">
              You already have an account?{" "}
              <Link
                to="/"
                color="blue"
              >
                Log in
              </Link>
            </Typography>
          )}
          <TextField
            label="Email"
            autoComplete={
              loaderData === "login"
                ? "email webauthn"
                : loaderData === "register"
                  ? "email"
                  : undefined
            }
            variant="outlined"
            type="email"
            size="medium"
            fullWidth
            value={field}
            sx={{ mt: 3 }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setField(event.target.value);
            }}
          />
          {error && (
            <Alert
              variant="filled"
              severity="error"
              sx={{ mt: 3 }}
            >
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
              {loaderData === "register" && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={async () => {
                    if (field === "") return;
                    await registrationStart();
                  }}
                >
                  Register
                </Button>
              )}
              {loaderData === "login" && (
                <>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={async () => {
                      await authenticationStart();
                    }}
                  >
                    Authenticate
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={async () => {
                      await passkeysAuthStart();
                    }}
                  >
                    Passkeys
                  </Button>
                </>
              )}
            </Stack>
          ) : (
            <Typography
              variant="h4"
              color="red"
              sx={{ mt: 3 }}
            >
              瀏覽器不支援 WebAuthn
            </Typography>
          )}
        </CardContent>
      </Card>
      <Box sx={{ mt: 3, width: "auto", textAlign: "left" }}>
        <FormControlLabel
          control={
            <Switch
              checked={showAdv}
              onChange={handleChange}
            />
          }
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
