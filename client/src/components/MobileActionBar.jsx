import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import PrintIcon from "@mui/icons-material/PrintOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

/* Phone par buttons neeche angoothe ke paas, hamesha dikhte hue */
export default function MobileActionBar({ ready, busy, missingCount, onPrint, onImages, onJump }) {
  return (
    <Paper
      elevation={0}
      className="no-print"
      sx={{
        display: { xs: "block", lg: "none" },
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1200,
        borderTop: 1,
        borderColor: "divider",
        borderRadius: 0,
        px: 1.5,
        pt: 1,
        pb: "calc(8px + env(safe-area-inset-bottom, 0px))"
      }}
    >
      {!ready && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
          {missingCount} detail baaki hai — bharne par Print chalu ho jaayega.
        </Typography>
      )}
      <Stack direction="row" spacing={1}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={onPrint}
          disabled={!ready}
        >
          Print / PDF
        </Button>
        <Button
          variant="outlined"
          startIcon={busy ? <CircularProgress size={15} /> : <ImageIcon />}
          onClick={onImages}
          disabled={busy || !ready}
          sx={{ flexShrink: 0 }}
        >
          Images
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onJump}
          sx={{ flexShrink: 0, minWidth: 44, px: 1 }}
          aria-label="Preview tak jao"
        >
          <ArrowDownwardIcon fontSize="small" />
        </Button>
      </Stack>
      <Box />
    </Paper>
  );
}
