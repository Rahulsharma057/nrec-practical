import { forwardRef } from "react";
import { ribbonBackground } from "../lib/fit.js";

// khali field ko halka grey rakho taaki saaf dikhe ki abhi asli naam nahi hai
const ghost = (value) => (value ? undefined : { color: "#b6b6b6" });

const CoverPage = forwardRef(function CoverPage({ t, student }, ref) {
  return (
    <div className="page" ref={ref}>
      <img className="cv-frame" src={t.frameUrl || "/frame.png"} alt="" />

      <div className="mid cv-college" data-fit-exact="626,64">
        {t.college}
      </div>
      <div className="mid cv-affil" data-fit-exact="509,23">
        {t.affiliation}
      </div>

      <img className="cv-logo" src={t.logoUrl || "/logo.jpg"} alt="College emblem" />

      <div className="cv-ribbon" style={{ backgroundImage: ribbonBackground() }}>
        <div className="cv-ribbon-text" data-fit-shrink="290,26">
          {t.session}
        </div>
      </div>

      <div className="cv-title" data-fit-block="478,38">
        {(t.titleLines || []).map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      <div className="mid cv-paper" data-fit-exact="309,31">
        {t.paperCode}
      </div>
      <div className="mid cv-class" data-fit-exact="441,31">
        {t.className}
      </div>

      <div className="cv-lbl cv-to-label">Submitted to :-</div>
      <div className="cv-nm cv-prof" data-fit-shrink="330,38">
        {t.professor}
      </div>

      <div className="cv-lbl cv-by-label">Submitted by :-</div>
      <div className="cv-nm cv-student" data-fit-shrink="330,38" style={ghost(student.name)}>
        {student.name || "Your Name"}
      </div>
      <div className="cv-nm cv-roll" data-fit-shrink="300,26" style={ghost(student.roll)}>
        {"Roll no : " + (student.roll || "\u2014")}
      </div>
      <div className="cv-nm cv-enroll" data-fit-shrink="300,26" style={ghost(student.enrollment)}>
        {"Enrollment no : " + (student.enrollment || "\u2014")}
      </div>
    </div>
  );
});

export default CoverPage;
