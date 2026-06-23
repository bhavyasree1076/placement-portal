const express = require("express");
const User = require("../models/User");
const upload = require("../middleware/upload");

const router = express.Router();

router.post(
  "/upload-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      const { userId } = req.body;

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        {
          resume: req.file.filename,
        },
        { new: true }
      );

      res.json({
        message: "Resume Uploaded",
        user,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.put("/update-profile/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Profile Updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/all-students", async (req, res) => {
  try {
    const students = await User.find();

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;