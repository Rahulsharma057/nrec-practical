import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import PrintIcon from "@mui/icons-material/PrintOutlined";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CoverPage from "../components/CoverPage.jsx";
import ImageDialog from "../components/ImageDialog.jsx";
import MobileActionBar from "../components/MobileActionBar.jsx";
import IndexEditor from "../components/IndexEditor.jsx";
import IndexPage from "../components/IndexPage.jsx";
import PaperStage from "../components/PaperStage.jsx";
import { api } from "../api.js";
import { FALLBACK_TEMPLATE } from "../lib/fallback.js";
import { applyFits, PAGE_H, PAGE_W } from "../lib/fit.js";

const STORAGE_KEY = "nrec-student";

function loadStudent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { name: "", roll: "", enrollment: "", ...JSON.parse(raw) };
  } catch {
    /* storage blocked */
  }
  return { name: "", roll: "", enrollment: "" };
}

export default function Home({ onLoadingChange }) {
  const [templates, setTemplates] = useState([FALLBACK_TEMPLATE]);
  const [activeKey, setActiveKey] = useState(FALLBACK_TEMPLATE.key);
  const [offline, setOffline] = useState(false);
  const [student, setStudent] = useState(loadStudent);
  const [custom, setCustom] = useState(null);
  const [sheet, setSheet] = useState(0);
  const [zoom, setZoom] = useState("fit");
  const [images, setImages] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const rootRef = useRef(null);
  const previewRef = useRef(null);
  const coverRef = useRef(null);
  const indexRef = useRef(null);

  useEffect(() => {
    let alive = true;
    onLoadingChange?.(true);
    api
      .listTemplates()
      .then((list) => {
        if (!alive || !list || !list.length) return;
        setTemplates(list);
        setActiveKey((list.find((t) => t.isDefault) || list[0]).key);
      })
      .catch(() => alive && setOffline(true))
      .finally(() => alive && onLoadingChange?.(false));
    return () => {
      alive = false;
      onLoadingChange?.(false);
    };
  }, [onLoadingChange]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
    } catch {
      /* storage blocked */
    }
  }, [student]);

  const base = useMemo(
    () => templates.find((t) => t.key === activeKey) || templates[0],
    [templates, activeKey]
  );

  useEffect(() => setCustom(null), [activeKey]);

  const template = useMemo(() => (custom ? { ...base, ...custom } : base), [base, custom]);
  const dirty = custom !== null;

  useLayoutEffect(() => {
    applyFits(rootRef.current);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => applyFits(rootRef.current));
    }
  });

  const setField = (field) => (e) => setStudent((s) => ({ ...s, [field]: e.target.value }));
  const patch = (changes) =>
    setCustom((c) => ({
      indexHeading: base.indexHeading,
      indexRows: base.indexRows,
      ...(c || {}),
      ...changes
    }));

  const missing = ["name", "roll", "enrollment"].filter((k) => !student[k].trim());
  const ready = missing.length === 0;

  async function makeImages() {
    setBusy(true);
    setError("");

    const wraps = Array.from(document.querySelectorAll(".sheet-wrap"));
    const wasHidden = wraps.map((el) => el.classList.contains("is-hidden"));
    wraps.forEach((el) => el.classList.remove("is-hidden"));

    const holders = Array.from(document.querySelectorAll(".stage-holder"));
    const saved = holders.map((h) => h.style.transform);
    holders.forEach((h) => (h.style.transform = "none"));

    // .stage-holder ka transform hata do, lekin uska parent "stage-size" box
    // (jo preview ke chhote screen-fit scale par size hua tha) waisa hi reh jaata
    // tha — isi se mobile par image/PDF A4 size se chhote box me clip ho jaati thi.
    const sizers = Array.from(document.querySelectorAll(".stage-size"));
    const savedSize = sizers.map((s) => ({ width: s.style.width, height: s.style.height }));
    sizers.forEach((s) => {
      s.style.width = PAGE_W + "px";
      s.style.height = PAGE_H + "px";
    });

    // "stage" khud bhi screen par chhoti (overflow hidden) hoti hai — usse bhi
    // khol do, warna upar wala full-size sizer isi ke andar clip ho jaata hai.
    const stages = Array.from(document.querySelectorAll(".stage"));
    const savedOverflow = stages.map((s) => s.style.overflow);
    stages.forEach((s) => (s.style.overflow = "visible"));

    const opts = {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      width: PAGE_W,
      height: PAGE_H,
      windowWidth: PAGE_W
    };

    try {
      const html2canvas = (await import("html2canvas")).default;
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const cover = await html2canvas(coverRef.current, opts);
      const index = await html2canvas(indexRef.current, opts);
      setImages([
        { label: "Front page", src: cover.toDataURL("image/png") },
        { label: "Index", src: index.toDataURL("image/png") }
      ]);
      setDialogOpen(true);
    } catch {
      setError("Image nahi ban paayi. Page reload karke dobara try karo.");
    } finally {
      holders.forEach((h, i) => (h.style.transform = saved[i]));
      sizers.forEach((s, i) => {
        s.style.width = savedSize[i].width;
        s.style.height = savedSize[i].height;
      });
      stages.forEach((s, i) => (s.style.overflow = savedOverflow[i]));
      wraps.forEach((el, i) => wasHidden[i] && el.classList.add("is-hidden"));
      setBusy(false);
    }
  }

  const actions = (
    <Stack direction="row" spacing={1} sx={{ display: { xs: "none", lg: "flex" } }}>
      <Tooltip title={ready ? "" : "Pehle teeno details bharo"}>
        <span>
          <Button
            variant="contained"
            size="small"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            disabled={!ready}
          >
            Print / PDF
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={ready ? "" : "Pehle teeno details bharo"}>
        <span>
          <Button
            variant="outlined"
            size="small"
            startIcon={busy ? <CircularProgress size={15} /> : <ImageIcon />}
            onClick={makeImages}
            disabled={busy || !ready}
          >
            {busy ? "Ban rahi hai…" : "Images"}
          </Button>
        </span>
      </Tooltip>
    </Stack>
  );

  return (
    <Container
      maxWidth="xl"
      ref={rootRef}
      sx={{ pt: { xs: 1.5, md: 3 }, pb: { xs: 14, lg: 3 } }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(320px, 380px) 1fr" },
          gap: { xs: 2.5, lg: 3 },
          alignItems: "start"
        }}
      >
        {/* ---------- controls ---------- */}
        <Stack
          spacing={2}
          className="no-print"
          sx={{
            minWidth: 0,
            position: { lg: "sticky" },
            top: { lg: 84 },
            maxHeight: { lg: "calc(100vh - 104px)" },
            overflowY: { lg: "auto" },
            pr: { lg: 0.5 }
          }}
        >
          {offline && (
            <Alert severity="warning">
              Server se baat nahi ho payi — built-in default template dikh raha hai.
            </Alert>
          )}
          {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography variant="overline">Tumhari details</Typography>
                <Chip
                  size="small"
                  variant="outlined"
                  color={ready ? "primary" : "default"}
                  label={3 - missing.length + "/3"}
                />
              </Stack>

              <Stack spacing={2}>
                <TextField
                  label="Student name"
                  value={student.name}
                  onChange={setField("name")}
                  placeholder="Salman Khan"
                  autoComplete="name"
                />
                <TextField
                  label="Roll no."
                  value={student.roll}
                  onChange={setField("roll")}
                  placeholder="240042140088"
                  inputProps={{ inputMode: "numeric" }}
                />
                <TextField
                  label="Enrollment no."
                  value={student.enrollment}
                  onChange={setField("enrollment")}
                  placeholder="M24917265"
                />
                {templates.length > 1 && (
                  <TextField
                    select
                    label="Subject / paper"
                    value={activeKey}
                    onChange={(e) => setActiveKey(e.target.value)}
                  >
                    {templates.map((t) => (
                      <MenuItem key={t.key} value={t.key}>
                        {t.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Stack>

              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                Yeh teen cheezein isi browser me yaad reh jaati hain. Baaki sab class ke liye fix hai.
              </Typography>
            </CardContent>
          </Card>

          <Accordion
            disableGutters
            elevation={0}
            sx={{ border: 1, borderColor: "divider", borderRadius: 2.5, "&:before": { display: "none" } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="overline">Index edit karo</Typography>
                <Chip size="small" variant="outlined" label={template.indexRows.length + " rows"} />
                {dirty && <Chip size="small" color="secondary" variant="outlined" label="badla hua" />}
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Yeh badlaav sirf tumhare page par lagte hain, class ka default waisa hi rehta hai.
              </Alert>
              <IndexEditor
                heading={template.indexHeading}
                rows={template.indexRows}
                dirty={dirty}
                onHeading={(indexHeading) => patch({ indexHeading })}
                onRows={(indexRows) => patch({ indexRows })}
                onReset={() => setCustom(null)}
              />
            </AccordionDetails>
          </Accordion>
        </Stack>

        {/* ---------- preview ---------- */}
        <Box sx={{ minWidth: 0 }} ref={previewRef}>
          <Paper
            variant="outlined"
            className="no-print"
            sx={{
              position: "sticky",
              top: { xs: 60, lg: 72 },
              zIndex: 2,
              px: { xs: 1, sm: 2 },
              py: 1,
              mb: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 2.5
            }}
          >
            <Tabs
              value={sheet}
              onChange={(e, v) => setSheet(v)}
              variant="fullWidth"
              sx={{ minHeight: 44, flexGrow: { xs: 1, lg: 0 }, width: { xs: "100%", lg: "auto" } }}
            >
              <Tab label="Front page" />
              <Tab label="Index" />
            </Tabs>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <ToggleButtonGroup
                size="small"
                exclusive
                value={zoom}
                onChange={(e, v) => v && setZoom(v)}
                sx={{ display: { xs: "none", md: "inline-flex" } }}
              >
                <ToggleButton value="fit">Fit</ToggleButton>
                <ToggleButton value={0.75}>75%</ToggleButton>
                <ToggleButton value={1}>100%</ToggleButton>
              </ToggleButtonGroup>
              {actions}
            </Stack>
          </Paper>

          {!ready && (
            <Alert severity="info" className="no-print" sx={{ mb: 2, display: { xs: "none", lg: "flex" } }}>
              Preview me abhi placeholder dikh raha hai. Teeno details bharte hi Print aur Images
              chalu ho jaayenge.
            </Alert>
          )}

          <PaperStage zoom={zoom} hidden={sheet !== 0}>
            <CoverPage ref={coverRef} t={template} student={student} />
          </PaperStage>
          <PaperStage zoom={zoom} hidden={sheet !== 1}>
            <IndexPage ref={indexRef} t={template} />
          </PaperStage>

          <Typography variant="caption" color="text.secondary" className="no-print" sx={{ display: "block", mt: 1.5 }}>
            Print dialog me paper A4 rakho aur "Headers and footers" band kar do, warna page par URL
            aur date chhap jaate hain.
          </Typography>
        </Box>
      </Box>

      <MobileActionBar
        ready={ready}
        busy={busy}
        missingCount={missing.length}
        onPrint={() => window.print()}
        onImages={makeImages}
        onJump={() => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
      />

      <ImageDialog open={dialogOpen} images={images} onClose={() => setDialogOpen(false)} />
    </Container>
  );
}
