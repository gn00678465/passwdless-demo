import { useState } from "react";
import type { ReactNode } from "react";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export interface RegistrationProps {
  isAvailable: boolean;
  children?: ReactNode;
  onRegistration?: (name: string) => Promise<void>;
}

export const Registration = ({ isAvailable, children, onRegistration }: RegistrationProps) => {
  const [field, setField] = useState("");

  return (
    <>
      {children}
      <Typography
        variant="h6"
        sx={{ fontWeight: 400, fontSize: { xs: "1rem", sm: "1.25rem" } }}
      >
        You already have an account?{" "}
        <Link
          to="/"
          color="blue"
        >
          Log in
        </Link>
      </Typography>

      <TextField
        label="Email"
        name="username"
        autoComplete="username"
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
              await onRegistration?.(field);
            }}
          >
            Register
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

export default Registration;
