import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export interface AuthenticationProps {
  isAvailable: boolean;
  children?: ReactNode;
  onAuthentication?: (name: string, single?: AbortSignal) => Promise<void>;
  onPasskeys?: (single?: AbortSignal) => Promise<void>;
}

const Authentication = ({
  isAvailable,
  children,
  onAuthentication,
  onPasskeys
}: AuthenticationProps) => {
  const [field, setField] = useState("");
  const abortControllerRef = useRef<null | AbortController>(null);

  useEffect(() => {
    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
    }
  }, []);

  function abort() {
    abortControllerRef.current?.abort("Abort previous request");
    abortControllerRef.current = new AbortController();
  }

  return (
    <>
      {children}
      <Typography
        variant="h6"
        sx={{ fontWeight: 400, fontSize: { xs: "1rem", sm: "1.25rem" } }}
      >
        No account yet?{" "}
        <Link
          to="/register"
          color="blue"
        >
          Sign up
        </Link>
      </Typography>

      <TextField
        label="Email"
        name="username"
        autoComplete="username webauthn"
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
          <Button
            variant="contained"
            fullWidth
            onClick={async () => {
              abort();
              await onAuthentication?.(field, abortControllerRef.current?.signal);
            }}
          >
            Authenticate
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={async () => {
              abort();
              await onPasskeys?.(abortControllerRef.current?.signal);
            }}
          >
            Passkeys
          </Button>
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
    </>
  );
};

export default Authentication;
