const express = require("express");
const Application = require("../models/Application");
const User = require("../models/User");
const Company = require("../models/Company");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.post("/apply", async (req, res) => {
  try {
    const { studentId, companyId } = req.body;

    const existingApplication =
      await Application.findOne({
        studentId,
        companyId,
      });

    if (existingApplication) {
      return res.status(400).json({
        message: "Already Applied",
      });
    }

    const application = new Application({
      studentId,
      companyId,
    });

    await application.save();

    res.status(201).json({
      message: "Applied Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get(
  "/company/:companyId",
  async (req, res) => {
    try {
      const applications =
        await Application.find({
          companyId: req.params.companyId,
        })
          .populate("studentId")
          .populate("companyId");

      res.json(applications);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
router.get("/student/:studentId", async (req, res) => {
  try {
    const applications = await Application.find({
      studentId: req.params.studentId,
    }).populate("companyId");

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("studentId")
      .populate("companyId");

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/status/:id", async (req, res) => {
  try {
    const application =
      await Application.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
          interviewDate:
            req.body.interviewDate || "",
          interviewTime:
            req.body.interviewTime || "",
        },
        { new: true }
      )
        .populate("studentId")
        .populate("companyId");

    if (application.studentId?.email) {
      await sendEmail(
        application.studentId.email,
        "Application Status Updated",
        `Your application for ${application.companyId.companyName} has been ${req.body.status}.`
      );
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count =
      await Application.countDocuments();

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/stats/:studentId", async (req, res) => {
  try {
    const applications = await Application.find({
      studentId: req.params.studentId,
    });

    const total = applications.length;

    const selected = applications.filter(
      (app) => app.status === "Selected"
    ).length;

    const pending = applications.filter(
      (app) => app.status === "Pending"
    ).length;

    const rejected = applications.filter(
      (app) => app.status === "Rejected"
    ).length;

    res.json({
      total,
      selected,
      pending,
      rejected,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ADMIN DASHBOARD STATS */
router.get("/admin-stats", async (req, res) => {
  try {
    const totalStudents =
      await User.countDocuments({
        role: "student",
      });

    const totalCompanies =
      await Company.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    const selected =
      await Application.countDocuments({
        status: "Selected",
      });

    const rejected =
      await Application.countDocuments({
        status: "Rejected",
      });

    const pending =
      await Application.countDocuments({
        status: "Pending",
      });

      const placementPercentage =
  totalStudents > 0
    ? (
        (selected / totalStudents) *
        100
      ).toFixed(2)
    : 0;

    res.json({
      totalStudents,
      totalCompanies,
      totalApplications,
      selected,
      rejected,
      pending,
      placementPercentage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/admin-stats", async (req, res) => {
  try {
    const User = require("../models/User");
    const Company = require("../models/Company");

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalCompanies =
      await Company.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    const selected =
      await Application.countDocuments({
        status: "Selected",
      });

    const rejected =
      await Application.countDocuments({
        status: "Rejected",
      });

    const pending =
      await Application.countDocuments({
        status: "Pending",
      });

    const placementPercentage =
      totalStudents > 0
        ? (
            (selected / totalStudents) *
            100
          ).toFixed(2)
        : 0;

    res.json({
      totalStudents,
      totalCompanies,
      totalApplications,
      selected,
      rejected,
      pending,
      placementPercentage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/withdraw/:id", async (req, res) => {
  try {
    await Application.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Application Withdrawn Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get(
  "/company-count/:companyId",
  async (req, res) => {
    try {
      const count =
        await Application.countDocuments({
          companyId:
            req.params.companyId,
        });

      res.json({ count });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
module.exports = router;