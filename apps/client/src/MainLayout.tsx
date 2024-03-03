import { Outlet } from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";

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
          {(children && children) || <Outlet />}
        </Container>
      </div>
    </>
  );
}
