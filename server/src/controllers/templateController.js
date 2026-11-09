const Template = require("../models/Template");
const { asyncHandler } = require("../middleware/error");

const listTemplates = asyncHandler(async (req, res) => {
  const items = await Template.find().sort({ isDefault: -1, label: 1 });
  res.json(items);
});

const getTemplate = asyncHandler(async (req, res) => {
  const item = await Template.findOne({ key: String(req.params.key).toLowerCase() });
  if (!item) {
    res.status(404);
    throw new Error("Template nahi mila");
  }
  res.json(item);
});

const createTemplate = asyncHandler(async (req, res) => {
  const item = await Template.create(req.body);
  res.status(201).json(item);
});

const updateTemplate = asyncHandler(async (req, res) => {
  const item = await Template.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!item) {
    res.status(404);
    throw new Error("Template nahi mila");
  }
  res.json(item);
});

const deleteTemplate = asyncHandler(async (req, res) => {
  const item = await Template.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Template nahi mila");
  }
  res.json({ message: "Template delete ho gaya" });
});

module.exports = { listTemplates, getTemplate, createTemplate, updateTemplate, deleteTemplate };
