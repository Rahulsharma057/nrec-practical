import { createTheme } from "@mui/material/styles";

/*
  Palette cover page se hi li gayi hai, bas thodi shaant kar di:
  ek gehra blue sab actions ke liye, purple sirf accent, aur neutral
  halke warm hain taaki safed A4 page screen par alag se ubhar aaye.
*/
const light = {
  primary: "#13537E",
  primaryHover: "#0E4367",
  secondary: "#6A3EB0",
  bg: "#EFEDE8",
  surface: "#FFFFFF",
  border: "#DFDAD1",
  text: "#171A1D",
  muted: "#5E666D"
};

const dark = {
  primary: "#79B8E0",
  primaryHover: "#9BCCEB",
  secondary: "#B79BE6",
  bg: "#131517",
  surface: "#1B1E21",
  border: "#2F3337",
  text: "#E8E6E1",
  muted: "#9BA1A7"
};

export function buildTheme(mode) {
  const c = mode === "dark" ? dark : light;

  return createTheme({
    palette: {
      mode,
      primary: { main: c.primary, dark: c.primaryHover },
      secondary: { main: c.secondary },
      background: { default: c.bg, paper: c.surface },
      divider: c.border,
      text: { primary: c.text, secondary: c.muted }
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"Jost", "Segoe UI", system-ui, sans-serif',
      h4: { fontFamily: '"Lato", "Segoe UI", sans-serif', fontWeight: 900, letterSpacing: "-0.5px" },
      h6: { fontFamily: '"Lato", "Segoe UI", sans-serif', fontWeight: 800, fontSize: "1.05rem" },
      overline: { fontWeight: 700, letterSpacing: "0.12em", color: c.muted },
      button: { textTransform: "none", fontWeight: 600 }
    },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiAppBar: { styleOverrides: { root: { backgroundColor: c.surface } } },
      MuiCard: {
        defaultProps: { variant: "outlined" },
        styleOverrides: { root: { borderColor: c.border } }
      },
      MuiAlert: { defaultProps: { variant: "outlined" } },
      MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
      MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiToggleButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 600, paddingTop: 4, paddingBottom: 4 }
        }
      },
      MuiTab: { styleOverrides: { root: { textTransform: "none", fontWeight: 600, minHeight: 44 } } }
    }
  });
}
