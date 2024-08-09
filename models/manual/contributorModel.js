const mongoose = require("mongoose");
const slugify = require("slugify");

const contributorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A contributor must be created by a user"],
    select: false,
  },
  group: {
    type: mongoose.Schema.ObjectId,
    required: [true, "A contributor must be belong to a group"],
    ref: "Group",
  },
  name: {
    type: String,
    unique: true,
    required: [true, "Contributor name must be given"],
  },
  slug: String,
  phoneNumber: Number,
  position: {
    type: Number,
    unique: true,
    required: [true, "Please provide the number to collect payment"],
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  owedContributors: Array,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// contributorSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "group",
//     select: "name",
//   });

//   next();
// });

contributorSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    trim: true,
  });

  next();
});

contributorSchema.pre("save", async function (next) {
  if (!this.isModified("owedContributors")) return next();

  const contributorsPromises = this.owedContributors.map(
    async (name) => await Contributor.findOne({ name: name }).select("name")
  );

  this.owedContributors = await Promise.all(contributorsPromises);
  next();
});

const Contributor = mongoose.model("Contributor", contributorSchema);

module.exports = Contributor;
