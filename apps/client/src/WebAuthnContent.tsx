import { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Collapse,
  Card,
  CardContent,
  Modal
} from "@mui/material";
import { useNavigate, useLoaderData, Link } from "react-router-dom";
import { isLocalAuthenticator } from "@webauthn/browser";
import { AdvanceOptionsContextProvider } from "./store";

import AdvanceContext from "./AdvanceContent";
import {
  useRegistration,
  usePassKeys,
  useAuthentication,
  useBoolean,
  useRegistrationAdvance,
  useAuthenticationAdvance
} from "./hooks";

export default function WebAuthnContext() {
  const [field, setField] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const navigate = useNavigate();
  const loaderData = useLoaderData() as "login" | "register";
  const { bool, setTrue, setFalse } = useBoolean();
  const { bool: showAdv, setBool: setShowAdv } = useBoolean(false);
  const [registerAdvOpts, dispatchRegisterAdvOpts] = useRegistrationAdvance();
  const [authAdvOpts, dispatchAuthAdvOpts] = useAuthenticationAdvance();

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
    params: registerAdvOpts,
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
        }
        if (error.name === "NotAllowedError") {
          setTrue();
        }
      }
      console.error(error);
    }
  });

  const { authenticationStart } = useAuthentication<{ status: "Success" }>(field, {
    params: authAdvOpts,
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
          setTrue();
        }
      }
      console.error(error);
    }
  });

  const { passkeysAuthStart } = usePassKeys<{ status: "Success" }>({
    params: authAdvOpts,
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
          setTrue();
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
    <>
      <Box
        maxWidth={600}
        sx={{ display: "inline-block", bgColor: "#fff", width: "100%" }}
      >
        <Card
          variant="outlined"
          sx={{ borderRadius: 3, boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)" }}
        >
          <CardContent>
            <Typography
              variant="h4"
              mb={1}
              sx={{ fontWeight: 500, fontSize: { xs: "1.875rem", sm: "2.125rem" } }}
            >
              {capitalizeCase(loaderData)}
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 400, fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              {loaderData === "login" && (
                <>
                  No account yet?{" "}
                  <Link
                    to="/register"
                    color="blue"
                  >
                    Sign up
                  </Link>
                </>
              )}
              {loaderData === "register" && (
                <>
                  You already have an account?{" "}
                  <Link
                    to="/"
                    color="blue"
                  >
                    Log in
                  </Link>
                </>
              )}
            </Typography>

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
            <AdvanceOptionsContextProvider
              registerAdvOpts={registerAdvOpts}
              dispatchRegisterAdvOpts={dispatchRegisterAdvOpts}
              authAdvOpts={authAdvOpts}
              dispatchAuthAdvOpts={dispatchAuthAdvOpts}
            >
              <AdvanceContext></AdvanceContext>
            </AdvanceOptionsContextProvider>
          </Collapse>
        </Box>
      </Box>
      <Modal
        open={bool}
        onClose={setFalse}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography>
            The operation either timed out or was not allowed. See:
            <Link
              target="_blank"
              color="blue"
              to="https://www.w3.org/TR/webauthn-2/#sctn-privacy-considerations-client."
            >
              https://www.w3.org/TR/webauthn-2/#sctn-privacy-considerations-client.
            </Link>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
