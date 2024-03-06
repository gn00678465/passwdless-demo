import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  IconButton,
  CircularProgress
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { authLogout } from "./service/auth";
import { getCredentials, deleteCredential, type CredentialInfo } from "./service/credentials";
import { Passkeys, Trash } from "./utils";
import { useBoolean } from "./hooks";

export function HomePage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<CredentialInfo[]>([]);
  const { bool: loading, setTrue: loadingStart, setFalse: loadingStop } = useBoolean(false);

  async function deleCredential(id: string) {
    try {
      loadingStart();
      const res = await deleteCredential(id);
      if (res.data.status === "Success") {
        setCredentials(res.data.data);
      }
      if (res.data.status === "Error") {
        console.error(new Error(res.data.message));
      }
    } catch (error) {
      console.error(error);
    } finally {
      loadingStop();
    }
  }

  useEffect(() => {
    async function fetchCredentials() {
      try {
        loadingStart();
        const res = await getCredentials();
        if (res.data.status === "Success") {
          setCredentials(res.data.data);
        }
        if (res.data.status === "Error") {
          console.error(new Error(res.data.message));
        }
      } catch (error) {
        console.error(error);
      } finally {
        loadingStop();
      }
    }
    fetchCredentials();
  }, []);

  return (
    <Box
      maxWidth={650}
      sx={{ display: "inline-block", bgColor: "#fff", width: "100%" }}
    >
      <Card>
        <CardContent>
          <Typography variant="h5">You're logged in.</Typography>
          <Button
            variant="contained"
            sx={{ my: 3 }}
            onClick={async () => {
              await authLogout();
              navigate("/");
            }}
          >
            Logout
          </Button>
          <Typography>These are your passkeys:</Typography>
          {loading ? (
            <Box
              sx={{
                height: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <List className="space-y-3">
              {credentials.map((credential) => {
                return (
                  <ListItem
                    key={credential.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          const confirm = window.confirm(
                            `是否要移除 Credential Id: ${credential.credential_id}`
                          );
                          if (confirm) {
                            deleCredential(credential.credential_id);
                          }
                        }}
                      >
                        <Trash />
                      </IconButton>
                    }
                    sx={{ border: "solid 1px #000", borderRadius: "0.5rem" }}
                  >
                    <ListItemIcon>
                      <Passkeys
                        width={36}
                        height={36}
                      />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      className="text-semibold"
                    >
                      <Typography fontWeight="bold">Passkey</Typography>
                      <Typography className="break-all">
                        Credential ID: {credential.credential_id}
                      </Typography>
                      <Typography className="break-all">
                        Created: {credential.created_at}
                      </Typography>
                      <Typography className="break-all">
                        Last used: {credential.updated_at}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default HomePage;
