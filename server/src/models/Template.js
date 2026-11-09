const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    label: { type: String, required: true, trim: true },
    college: { type: String, default: "N.R.E.C. College, Khurja" },
    affiliation: { type: String, default: "(Affiliated to CCS University Meerut & Approved by BCI)" },
    session: { type: String, default: "Session : 2025-26" },
    titleLines: { type: [String], default: [] },
    paperCode: { type: String, default: "" },
    className: { type: String, default: "" },
    professor: { type: String, default: "" },
    indexHeading: { type: String, default: "Practical Training" },
    indexRows: { type: [String], default: [] },
    logoUrl: { type: String, default: "/logo.jpg" },
    frameUrl: { type: String, default: "/frame.png" },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", templateSchema);
