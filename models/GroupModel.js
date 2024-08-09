const mongoose = require("mongoose");
const slugify = require("slugify");
const Contrib = require("./manual/contribModel");

const groupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A group must be created by a user"],
    select: false,
  },
  name: {
    type: String,
    required: [true, "A contribution group must have a name"],
    unique: true,
  },
  targetAmount: {
    type: Number,
    required: [true, "Target amount must be provided"],
    min: [1000, "Target amount must be greater >= 1000"],
  },
  frequency: {
    type: String,
    required: [true, "payment frequency must be provided"],
    enum: ["daily", "weekly", "monthly"],
  },
  startDate: {
    type: Date,
    default: Date.now(),
    required: [true, "payment starting date must be provided"],
  },
  admin: {
    type: String,
    required: [true, "A group must belong to an admin"],
  },
  slug: String,
  collectionDate: Date,
  nextPaymentTo: String,
  memberCount: Number,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

groupSchema.virtual("contributions", {
  ref: "Contribution",
  foreignField: "group",
  localField: "_id",
});

groupSchema.pre("findOneAndDelete", async function (next) {
  const id = this._id;
  await Contrib.deleteMany({ group: id });

  next();
});

groupSchema.pre("deleteMany", async function (next) {
  const groups = await Group.find();
  const groupIDs = groups.map((doc) => doc._id);

  await Contrib.deleteMany({ group: { $in: groupIDs } });

  next();
});

groupSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    trim: true,
  });

  next();
});

groupSchema.pre("save", function (next) {
  if (!this.isModified("startDate") || !this.isModified("frequency")) next();

  const interval = this.frequency === "daily" ? 1 : this.frequency === "weekly" ? 6 : 30;

  this.collectionDate = this.startDate.getTime() + interval * 24 * 60 * 60 * 1000;

  next();
});

groupSchema.pre("save", function (next) {
  if (this.collectionDate && this.collectionDate.getTime() < Date.now()) {
    const interval =
      this.frequency === "daily" ? 1 : this.frequency === "weekly" ? 7 : 30;

    this.collectionDate = this.startDate.getTime() + interval * 24 * 60 * 60 * 1000;
  }

  next();
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
