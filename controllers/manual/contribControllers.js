const Contrib = require("../../models/manual/contribModel");

const APIFeatures = require("../../utils/apiFeatures");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

exports.addReferenceIDToContribution = (req, res, next) => {
  req.body.group = req.params.groupID;

  next();
};

exports.deleteAllContribs = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.currentUser) {
    filter.user = req.currentUser.id;
  }

  if (req.params.groupID) {
    filter.group = req.params.groupID;
  }

  await Contrib.deleteMany(filter);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllContrib = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.groupID) filter.group = req.params.groupID;
  if (req.currentUser) filter.user = req.currentUser.id;

  const features = new APIFeatures(Contrib.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const contributions = await features.query;

  res.status(200).json({
    status: "success",
    total: contributions.length,
    data: {
      contributions,
    },
  });
});

exports.createContrib = catchAsync(async (req, res, next) => {
  const contribution = await Contrib.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      contribution,
    },
  });
});

exports.getContrib = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.groupID) {
    filter = { _id: req.params.id, group: req.params.groupID };
  } else {
    filter = { _id: req.params.id };
  }

  const contribution = await Contrib.findById(filter).populate("group");

  if (!contribution) {
    return next(new AppError("No contribution found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      contribution,
    },
  });
});

exports.updateContrib = catchAsync(async (req, res, next) => {
  const contribution = await Contrib.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!contribution) {
    return next(new AppError("No contribution found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      contribution,
    },
  });
});

exports.deleteContrib = catchAsync(async (req, res, next) => {
  const contribution = await Contrib.findByIdAndDelete(req.params.id);

  if (!contribution) {
    return next(new AppError("No contribution found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
  });
});
