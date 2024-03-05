import { Outlet } from "react-router-dom";
import { Container, CssBaseline, Typography } from "@mui/material";

interface Props {
  children?: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <>
      <CssBaseline />
      <div className="size-full bg-[#eef7ff]">
        <Container
          className="absolute position-center overflow-y-auto"
          sx={{ textAlign: "center", py: { xs: 4, sm: 0 } }}
        >
          <Typography
            variant="h3"
            gutterBottom
            align="center"
            fontWeight="bold"
            sx={{ fontSize: { xs: "2.25rem", sm: "3rem" } }}
          >
            PasswdLess Demo
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            align="center"
            mb={3}
          >
            A demo of the WebAuthn specification
          </Typography>
          {(children && children) || <Outlet />}
        </Container>
      </div>
    </>
  );
}
