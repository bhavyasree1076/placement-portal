const express = require("express");
const Announcement = require("../models/Announcement");

const router = express.Router();

/* Add Announcement */
router.post("/add", async (req, res) => {
  try {
    const announcement =
      new Announcement(req.body);

    await announcement.save();

    res.json({
      message:
        "Announcement Added Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* Get All Announcements */
router.get("/all", async (req, res) => {
  try {
    const announcements =
      await Announcement.find().sort({
        createdAt: -1,
      });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;