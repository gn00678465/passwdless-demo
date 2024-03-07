import { useState } from "react";
import type { ReactNode } from "react";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export interface AuthenticationProps {
  isAvailable: boolean;
  children?: ReactNode;
  onAuthentication?: (name: string) => Promise<void>;
  onPasskeys?: () => Promise<void>;
}

const Authentication = ({
  isAvailable,
  children,
  onAuthentication,
  onPasskeys
}: AuthenticationProps) => {
  const [field, setField] = useState("");
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
              await onAuthentication?.(field);
            }}
          >
            Authenticate
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={async () => {
              await onPasskeys?.();
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
