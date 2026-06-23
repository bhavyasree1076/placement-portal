const express = require("express");
const Company = require("../models/Company");
const Application = require("../models/Application");
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const company = new Company(req.body);

    await company.save();

    res.status(201).json({
      message: "Company Added Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const companies = await Company.find();

    res.json(companies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count = await Company.countDocuments();

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    // Delete all applications of this company
    await Application.deleteMany({
      companyId: req.params.id,
    });

    // Delete company
    await Company.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Company and related applications deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Company Updated",
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;