import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { PAGE_H, PAGE_W } from "../lib/fit.js";

// zoom: "fit" ya 0.75 / 1 jaisa number
export default function PaperStage({ zoom = "fit", hidden = false, children }) {
  const stageRef = useRef(null);
  const [fitScale, setFitScale] = useState(1);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const resize = () => {
      if (node.clientWidth) setFitScale(Math.min(1, node.clientWidth / PAGE_W));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const scale = zoom === "fit" ? fitScale : zoom;
  const zoomedIn = scale > fitScale + 0.001;

  return (
    <Box className={"sheet-wrap" + (hidden ? " is-hidden" : "")}>
      <Box
        ref={stageRef}
        className="stage"
        sx={{ overflowX: zoomedIn ? "auto" : "hidden", overflowY: "hidden" }}
      >
        {/* scaled page jitni hi jagah ghere, taaki centering theek baithe */}
        <Box
          sx={{
            width: PAGE_W * scale,
            height: PAGE_H * scale,
            mx: zoomedIn ? 0 : "auto"
          }}
        >
          <div className="stage-holder" style={{ transform: "scale(" + scale + ")", width: PAGE_W }}>
            {children}
          </div>
        </Box>
      </Box>
    </Box>
  );
}
