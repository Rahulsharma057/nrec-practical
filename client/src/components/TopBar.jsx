import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation } from "react-router-dom";

export default function TopBar({ mode, onToggleMode, user, onLogout, loading }) {
  const { pathname } = useLocation();
  const onAdmin = pathname.startsWith("/admin");

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      className="no-print"
      sx={{ borderBottom: 1, borderColor: "divider", backdropFilter: "blur(6px)" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 1.5 }}>
          <Avatar
            src="/logo.jpg"
            alt=""
            variant="circular"
            sx={{ width: 36, height: 36, bgcolor: "transparent", display: { xs: "none", sm: "flex" } }}
          />
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              color="text.primary"
              sx={{ textDecoration: "none", display: "block", lineHeight: 1.2 }}
              noWrap
            >
              Front Page Maker
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: { xs: "none", sm: "block" } }}>
              N.R.E.C. College, Khurja — ek hi design, poori class ke liye
            </Typography>
          </Box>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
              <IconButton onClick={onToggleMode} aria-label="Theme badlo">
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            {user ? (
              <>
                {!onAdmin && (
                  <Button component={RouterLink} to="/admin" size="small">
                    Templates
                  </Button>
                )}
                <Button size="small" color="inherit" onClick={onLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button component={RouterLink} to="/login" size="small" color="inherit">
                Admin
              </Button>
            )}
          </Stack>
        </Toolbar>
      </Container>
      {loading && <LinearProgress sx={{ height: 2 }} />}
    </AppBar>
  );
}
