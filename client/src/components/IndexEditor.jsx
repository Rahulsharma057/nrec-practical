import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export default function IndexEditor({ heading, rows, onHeading, onRows, onReset, dirty }) {
  const update = (i, value) => onRows(rows.map((r, idx) => (idx === i ? value : r)));
  const remove = (i) => onRows(rows.filter((_, idx) => idx !== i));
  const add = () => onRows([...rows, ""]);

  const move = (i, delta) => {
    const next = [...rows];
    const target = i + delta;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    onRows(next);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Index heading"
        value={heading}
        onChange={(e) => onHeading(e.target.value)}
        helperText="Table ke sabse upar wali line"
      />

      <Stack spacing={1}>
        {rows.map((row, i) => (
          <Stack key={i} direction="row" spacing={0.5} alignItems="center">
            <TextField
              label={"Row " + (i + 1)}
              value={row}
              onChange={(e) => update(i, e.target.value)}
              multiline
              maxRows={3}
            />
            <Stack>
              <IconButton size="small" onClick={() => move(i, -1)} disabled={i === 0} aria-label={"Row " + (i + 1) + " upar"}>
                <ArrowUpwardIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1}
                aria-label={"Row " + (i + 1) + " neeche"}
              >
                <ArrowDownwardIcon fontSize="inherit" />
              </IconButton>
            </Stack>
            <Tooltip title="Row hatao">
              <span>
                <IconButton size="small" color="default" onClick={() => remove(i)} aria-label={"Row " + (i + 1) + " delete"}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button size="small" startIcon={<AddIcon />} onClick={add}>
          Row add karo
        </Button>
        <Button size="small" color="inherit" startIcon={<RestartAltIcon />} onClick={onReset} disabled={!dirty}>
          Default wapas lao
        </Button>
      </Stack>

      <Box>
        <Typography variant="caption" color="text.secondary">
          {rows.length} rows. Row height apne aap adjust ho jaati hai, table hamesha ek hi page me
          rehti hai. 14 se zyada rows par text kaafi chhota lagne lagega.
        </Typography>
      </Box>
    </Stack>
  );
}
