const mongoose = require("mongoose");

const Contributor = require("./contributorModel");
const AppError = require("../../utils/appError");

const contribSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.ObjectId,
      ref: "Group",
      required: [true, "Contribution must belong to a contribution group"],
    },
    contributor: {
      type: Object,
      required: [true, "Please select who is paying for his/her contribution"],
    },
    expectedAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [1, "Expected amount to be paid must be a greater than 1"],
    },
    paidAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Paid amount must be a positive value"],
    },
    paidOn: {
      type: [Date],
      default: Date.now(),
    },
    contributionRound: Number,
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "incomplete", "complete"],
    },
    note: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

contribSchema.virtual("remainingAmount").get(function () {
  return this.expectedAmount - this.paidAmount;
});

contribSchema.pre(/^find/, function (next) {
  this.populate({
    path: "group",
    select: "name",
  });

  next();
});

contribSchema.pre("save", async function (next) {
  const name = this.contributor;

  const contributor = await Contributor.findOne({ name: name }).select(
    "name position isPaid"
  );

  if (!contributor)
    return next(
      new AppError(
        "No contributor found with that name. Make sure it is written exactly as it was saved or create a new contributor with that name",
        404
      )
    );
  this.contributor = contributor;

  next();
});

const Contrib = mongoose.model("Contribution", contribSchema);

module.exports = Contrib;
