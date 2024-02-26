import { Outlet } from "react-router-dom";
import { Container, CssBaseline, Typography } from "@mui/material";

interface Props {
  children?: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <>
      <CssBaseline />
      <div className="size-full flex-center bg-[#eef7ff]">
        <Container sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            gutterBottom
            align="center"
          >
            PasswdLess Demo
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            align="center"
          >
            A demo of the WebAuthn specification
          </Typography>
          {children}
          <Outlet />
        </Container>
      </div>
    </>
  );
}
