import { useContext } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { AdvanceOptionsContext } from "./store";

function AdvanceContext() {
  const { registerAdvOpts, dispatchRegisterAdvOpts } = useContext(AdvanceOptionsContext);

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)" }}
    >
      <CardContent>
        <Typography
          sx={{
            textDecoration: "underline",
            textDecorationStyle: "solid",
            textDecorationLine: "underline"
          }}
        >
          Registration Settings
        </Typography>
        <Grid
          container
          spacing={4}
          columns={{ xs: 4, sm: 8 }}
          sx={{ pt: 3, pb: 3 }}
        >
          <Grid
            item
            xs={4}
            sm={4}
          >
            <FormControl
              sx={{ width: "100%" }}
              size="small"
            >
              <InputLabel id="user-verification-label">User Verification</InputLabel>
              <Select
                labelId="user-verification-label"
                id="user-verification"
                label="User Verification"
                defaultValue={"preferred"}
                value={registerAdvOpts?.authenticatorSelection?.userVerification}
                onChange={(event) => {
                  const value = event.target.value as UserVerificationRequirement;
                  dispatchRegisterAdvOpts?.({ type: "USER_VERIFICATION", payload: value });
                }}
              >
                <MenuItem value="discouraged">Discouraged</MenuItem>
                <MenuItem value="preferred">Preferred</MenuItem>
                <MenuItem value="required">Required</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
          >
            <FormControl
              sx={{ width: "100%" }}
              size="small"
            >
              <InputLabel id="attachment-label">Attachment</InputLabel>
              <Select
                labelId="attachment-label"
                id="attachment"
                label="Attachment"
                defaultValue={"both"}
                onChange={(event) => {
                  const value = event.target.value as AuthenticatorAttachment | "both";
                  if (value !== "both") {
                    dispatchRegisterAdvOpts?.({ type: "ATTACHMENT", payload: value });
                  } else {
                    dispatchRegisterAdvOpts?.({ type: "ATTACHMENT", payload: undefined });
                  }
                }}
              >
                <MenuItem value={"both"}>All Supported</MenuItem>
                <MenuItem value="cross-platform">Cross-Platform</MenuItem>
                <MenuItem value="platform">Platform</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
          >
            <FormControl
              sx={{ width: "100%" }}
              size="small"
            >
              <InputLabel id="discoverable-credential-label">Discoverable Credential</InputLabel>
              <Select
                labelId="discoverable-credential-label"
                id="discoverable-credential"
                label="Discoverable Credential"
                defaultValue={"preferred"}
                value={registerAdvOpts?.authenticatorSelection?.residentKey}
                onChange={(event) => {
                  const value = event.target.value as ResidentKeyRequirement;
                  dispatchRegisterAdvOpts?.({ type: "RESIDENTKEY", payload: value });
                }}
              >
                <MenuItem value="discouraged">Discouraged</MenuItem>
                <MenuItem value="preferred">Preferred</MenuItem>
                <MenuItem value="required">Required</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
          >
            <FormControl
              sx={{ width: "100%" }}
              size="small"
            >
              <InputLabel id="attestation-label">Attestation</InputLabel>
              <Select
                labelId="attestation-label"
                id="attestation"
                label="Attestation"
                defaultValue={"none"}
                value={registerAdvOpts?.attestation}
                onChange={(event) => {
                  const value = event.target.value as AttestationConveyancePreference;
                  dispatchRegisterAdvOpts?.({ type: "ATTESTATION", payload: value });
                }}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="direct">Direct</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Typography
          sx={{
            textDecoration: "underline",
            textDecorationStyle: "solid",
            textDecorationLine: "underline"
          }}
        >
          Authentication Settings
        </Typography>
        <Grid
          container
          spacing={4}
          columns={{ xs: 4, sm: 8 }}
          sx={{ pt: 3, pb: 3 }}
        >
          <Grid
            item
            xs={4}
            sm={4}
          >
            <FormControl
              sx={{ width: "100%" }}
              size="small"
            >
              <InputLabel id="user-verification-label">User Verification</InputLabel>
              <Select
                labelId="user-verification-label"
                id="user-verification"
                label="User Verification"
                defaultValue={"preferred"}
              >
                <MenuItem value="discouraged">Discouraged</MenuItem>
                <MenuItem value="preferred">Preferred</MenuItem>
                <MenuItem value="required">Required</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default AdvanceContext;
