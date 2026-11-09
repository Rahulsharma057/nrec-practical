import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/EditOutlined";
import UploadIcon from "@mui/icons-material/CloudUploadOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { api } from "../api.js";

const BLANK = {
  key: "",
  label: "",
  college: "N.R.E.C. College, Khurja",
  affiliation: "(Affiliated to CCS University Meerut & Approved by BCI)",
  session: "Session : 2025-26",
  titleLines: [],
  paperCode: "",
  className: "",
  professor: "",
  indexHeading: "Practical Training",
  indexRows: [],
  logoUrl: "/logo.jpg",
  frameUrl: "/frame.png",
  isDefault: false
};

export default function AdminTemplates() {
  const [list, setList] = useState([]);
  const [draft, setDraft] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState("");

  async function load() {
    try {
      setList(await api.listTemplates());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));
  const setLines = (field) => (e) =>
    setDraft((d) => ({ ...d, [field]: e.target.value.split("\n").filter((l) => l.trim() !== "") }));

  async function save(e) {
    e.preventDefault();
    setError("");
    try {
      if (draft._id) await api.updateTemplate(draft._id, draft);
      else await api.createTemplate(draft);
      setToast("Save ho gaya");
      setDraft(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(item) {
    setConfirm(null);
    try {
      await api.deleteTemplate(item._id);
      setToast("Delete ho gaya: " + item.label);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function upload(field, file) {
    if (!file) return;
    setUploading(field);
    setError("");
    try {
      const { url } = await api.uploadImage(file);
      setDraft((d) => ({ ...d, [field]: url }));
      setToast("Upload ho gaya");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading("");
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Templates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Subject, paper code, session aur index ke topics yahan se badlo. Students ko agli baar
            page kholte hi naya version mil jaayega.
          </Typography>
        </Box>

        {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="overline" color="text.secondary">
                Saare templates
              </Typography>
              <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => setDraft({ ...BLANK })}>
                Naya template
              </Button>
            </Stack>

            {list.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Abhi koi template nahi hai.
              </Typography>
            ) : (
              <Stack divider={<Divider />}>
                {list.map((item) => (
                  <Stack
                    key={item._id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ py: 1.5 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Typography fontWeight={600}>{item.label}</Typography>
                        {item.isDefault && <Chip size="small" color="primary" label="default" />}
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {item.key} · {(item.indexRows || []).length} index rows
                      </Typography>
                    </Box>
                    <Stack direction="row">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => setDraft({ ...BLANK, ...item })}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => setConfirm(item)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={Boolean(draft)} onClose={() => setDraft(null)} maxWidth="md" fullWidth>
        {draft && (
          <Box component="form" onSubmit={save}>
            <DialogTitle>{draft._id ? "Template edit karo" : "Naya template"}</DialogTitle>
            <DialogContent dividers>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                  pt: 1
                }}
              >
                <TextField label="Key (unique, URL-safe)" value={draft.key} onChange={set("key")} required />
                <TextField label="Label (dropdown me dikhega)" value={draft.label} onChange={set("label")} required />
                <TextField label="College" value={draft.college} onChange={set("college")} />
                <TextField label="Affiliation line" value={draft.affiliation} onChange={set("affiliation")} />
                <TextField label="Session" value={draft.session} onChange={set("session")} />
                <TextField label="Paper code line" value={draft.paperCode} onChange={set("paperCode")} />
                <TextField label="Class & semester" value={draft.className} onChange={set("className")} />
                <TextField label="Professor" value={draft.professor} onChange={set("professor")} />
                <TextField label="Index heading" value={draft.indexHeading} onChange={set("indexHeading")} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(draft.isDefault)}
                      onChange={(e) => setDraft((d) => ({ ...d, isDefault: e.target.checked }))}
                    />
                  }
                  label="Default template"
                />

                <Stack spacing={1}>
                  <TextField label="Logo URL" value={draft.logoUrl} onChange={set("logoUrl")} />
                  <Button
                    component="label"
                    size="small"
                    startIcon={<UploadIcon />}
                    disabled={uploading === "logoUrl"}
                  >
                    {uploading === "logoUrl" ? "Upload ho raha hai…" : "Logo upload karo"}
                    <input hidden type="file" accept="image/*" onChange={(e) => upload("logoUrl", e.target.files[0])} />
                  </Button>
                </Stack>
                <Stack spacing={1}>
                  <TextField label="Border / frame URL" value={draft.frameUrl} onChange={set("frameUrl")} />
                  <Button
                    component="label"
                    size="small"
                    startIcon={<UploadIcon />}
                    disabled={uploading === "frameUrl"}
                  >
                    {uploading === "frameUrl" ? "Upload ho raha hai…" : "Border upload karo"}
                    <input hidden type="file" accept="image/*" onChange={(e) => upload("frameUrl", e.target.files[0])} />
                  </Button>
                </Stack>

                <TextField
                  sx={{ gridColumn: "1 / -1" }}
                  label="Subject title (3 lines — har line alag)"
                  multiline
                  rows={3}
                  value={(draft.titleLines || []).join("\n")}
                  onChange={setLines("titleLines")}
                />
                <TextField
                  sx={{ gridColumn: "1 / -1" }}
                  label="Index topics (ek line = ek row)"
                  multiline
                  rows={10}
                  value={(draft.indexRows || []).join("\n")}
                  onChange={setLines("indexRows")}
                  helperText="Row height rows ki ginti ke hisaab se apne aap set ho jaati hai"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button color="inherit" onClick={() => setDraft(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>

      <Dialog open={Boolean(confirm)} onClose={() => setConfirm(null)}>
        <DialogTitle>Template delete karein?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {confirm ? confirm.label : ""} hamesha ke liye hat jaayega. Jo students yeh subject chun
            rahe the unhe ab yeh nahi dikhega.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setConfirm(null)}>
            Rehne do
          </Button>
          <Button color="error" variant="contained" onClick={() => remove(confirm)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        message={toast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
}
