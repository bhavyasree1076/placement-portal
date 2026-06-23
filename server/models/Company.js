const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    package: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },
    minCGPA: {
  type: Number,
  default: 0,
},

    description: {
      type: String,
      required: true,
    },
    process: {
  type: String,
  default: "",
},
    deadline: {
  type: Date,
},
status: {
  type: String,
  enum: ["Open", "Closed"],
  default: "Open",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);