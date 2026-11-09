import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function ImageDialog({ open, images, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ pr: 6 }}>
        Images taiyaar hain
        <IconButton onClick={onClose} aria-label="Band karo" sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          Image par right-click karke <strong>Save image as…</strong> chuno. Mobile par image ko der
          tak dabao, phir <strong>Download image</strong>.
        </Alert>
        <Stack spacing={3}>
          {images.map((img) => (
            <Box key={img.label}>
              <Typography variant="overline" color="text.secondary">
                {img.label}
              </Typography>
              <Box
                component="img"
                src={img.src}
                alt={img.label}
                sx={{ width: "100%", borderRadius: 1, border: 1, borderColor: "divider", bgcolor: "#fff" }}
              />
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
