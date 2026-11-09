import { useCallback, useEffect, useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThemeProvider } from "@mui/material/styles";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import TopBar from "./components/TopBar.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminTemplates from "./pages/AdminTemplates.jsx";
import Home from "./pages/Home.jsx";
import { api, getToken, setToken } from "./api.js";
import { buildTheme } from "./theme.js";

const MODE_KEY = "nrec-theme";

function readMode() {
  try {
    return localStorage.getItem(MODE_KEY);
  } catch {
    return null;
  }
}

export default function App() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(() => readMode() || (prefersDark ? "dark" : "light"));
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(Boolean(getToken()));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const theme = useMemo(() => buildTheme(mode), [mode]);
  const onLoadingChange = useCallback((value) => setLoading(value), []);

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      /* storage blocked */
    }
  }, [mode]);

  useEffect(() => {
    if (!getToken()) return;
    api
      .me()
      .then((data) => setUser(data.user))
      .catch(() => setToken(""))
      .finally(() => setChecking(false));
  }, []);

  function logout() {
    setToken("");
    setUser(null);
    navigate("/");
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar
        mode={mode}
        onToggleMode={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
        user={user}
        onLogout={logout}
        loading={loading}
      />
      <Routes>
        <Route path="/" element={<Home onLoadingChange={onLoadingChange} />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/admin" replace /> : <AdminLogin onLogin={setUser} />}
        />
        <Route
          path="/admin"
          element={checking ? null : user ? <AdminTemplates /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
