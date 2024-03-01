import { ReactNode, Dispatch, SetStateAction } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface Props {
  children?: ReactNode;
  attachment: AuthenticatorAttachment | undefined;
  setAttachment: Dispatch<SetStateAction<AuthenticatorAttachment | undefined>>;
}

function AdvanceContext({ attachment, setAttachment }: Props) {
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as AuthenticatorAttachment | undefined | "both";
    setAttachment(() => {
      if (value === "both") return undefined;
      return value;
    });
  };

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)" }}
    >
      <CardContent>
        <Typography>Registration Settings</Typography>
        <FormControl
          sx={{ m: 1, minWidth: 180 }}
          size="small"
        >
          <InputLabel id="demo-select-small-label">Attachment</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="Attachment"
            defaultValue={"both"}
            value={!attachment ? "both" : attachment}
            onChange={handleChange}
          >
            <MenuItem value="both">All Supported</MenuItem>
            <MenuItem value="cross-platform">Cross-Platform</MenuItem>
            <MenuItem value="platform">Platform</MenuItem>
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}

export default AdvanceContext;
