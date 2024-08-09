const Contributor = require("../../models/manual/contributorModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("./../../utils/appError");

exports.addUserIDAndGroupIDToContributor = (req, res, next) => {
  req.body.user = req.currentUser.id;

  if (req.params.groupID) {
    req.body.group = req.params.groupID;
  }
  next();
};

exports.getAllContributors = catchAsync(async (req, res, next) => {
  const contributors = await Contributor.find({
    group: req.params.groupID,
    user: req.currentUser.id,
  }).populate("group");

  res.status(200).json({
    status: "success",
    total: contributors.length,
    data: {
      contributors,
    },
  });
});

exports.createContributor = catchAsync(async (req, res, next) => {
  const contributor = await Contributor.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      contributor,
    },
  });
});

exports.getContributor = catchAsync(async (req, res, next) => {
  const contributor = await Contributor.findById(req.params.id).populate("group");

  if (!contributor) {
    return next(new AppError("No contributor found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      contributor,
    },
  });
});

exports.updateContributor = catchAsync(async (req, res, next) => {
  const contributor = await Contributor.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!contributor) {
    return next(new AppError("No contributor found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      contributor,
    },
  });
});

exports.deleteContributor = catchAsync(async (req, res, next) => {
  const contributor = await Contributor.findByIdAndDelete(req.params.id);

  if (!contributor) {
    return next(new AppError("No contributor found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
  });
});
