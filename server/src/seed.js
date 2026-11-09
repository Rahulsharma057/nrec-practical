require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Template = require("./models/Template");

const DEFAULT_TEMPLATE = {
  key: "llb-2-practical-training",
  label: "LL.B. 2nd Year (III Sem) — Practical Training",
  college: "N.R.E.C. College, Khurja",
  affiliation: "(Affiliated to CCS University Meerut & Approved by BCI)",
  session: "Session : 2025-26",
  titleLines: ["Professional Ethics,", "Accountability of Lawyers", "and Bar Bench Relation"],
  paperCode: "(Paper Code : K-3005)",
  className: "LL.B. 2nd Year (III Semester)",
  professor: "Prof. Vaishali Gupta",
  indexHeading: "Practical Training",
  indexRows: [
    "भारत में वर्तमान न्याय व्यवस्था",
    "जनहित याचिका",
    "वैकल्पिक विवाद समाधान प्रणाली",
    "वैकल्पिक विवाद समाधान प्रणाली के प्रकार",
    "लोक अदालत",
    "मध्यस्थता समझौता, अंतर्राष्ट्रीय वाणिज्यिक मध्यस्थता, संरचना और क्षेत्राधिकार",
    "मध्यस्थता कार्यवाही का संचालन, निर्णय का निर्माण और समाप्ति",
    "मध्यस्थता निर्णय की अंतिमता और प्रवर्तन",
    "सुलह (कन्सिलिएशन)",
    "मध्यस्थता / मेडिएशन"
  ],
  logoUrl: "/logo.jpg",
  frameUrl: "/frame.png",
  isDefault: true
};

async function run() {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL aur ADMIN_PASSWORD .env me daalo");

  let admin = await User.findOne({ email });
  if (admin) {
    console.log("Admin pehle se hai:", email);
  } else {
    admin = await User.create({ name: "Admin", email, password, role: "admin" });
    console.log("Admin ban gaya:", email);
  }

  const existing = await Template.findOne({ key: DEFAULT_TEMPLATE.key });
  if (existing) {
    await Template.updateOne({ _id: existing._id }, DEFAULT_TEMPLATE);
    console.log("Default template update ho gaya");
  } else {
    await Template.create(DEFAULT_TEMPLATE);
    console.log("Default template ban gaya");
  }

  await mongoose.connection.close();
  console.log("Seed complete");
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
