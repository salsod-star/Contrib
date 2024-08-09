const Group = require("../models/GroupModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.addCurrentUserIDToGroupAndSetNameToAdmin = (req, res, next) => {
  req.body.user = req.currentUser.id;
  req.body.admin = req.currentUser.name;
  next();
};

exports.getAllGroups = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.currentUser) {
    filter = { user: req.currentUser.id };
  }

  const groups = await Group.find(filter);

  res.status(200).json({
    status: "success",
    total: groups.length,
    data: {
      groups,
    },
  });
});

exports.deleteAllGroups = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.currentUser) {
    filter = { user: req.currentUser.id };
  }

  await Group.deleteMany(filter);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createGroup = catchAsync(async (req, res, next) => {
  const newGroup = await Group.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      group: newGroup,
    },
  });
});

exports.getGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findOne({ slug: req.params.slug }).populate("contributions");

  if (!group) return next(new AppError("No group found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

exports.updateGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findOneAndUpdate({ slug: req.params.slug }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!group) return next(new AppError("No group found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

exports.deleteGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByIdAndDelete({ slug: req.params.slug });

  if (!group) return next(new AppError("No group found with that ID", 404));

  res.status(204).json({
    status: "success",
    data: {
      group,
    },
  });
});
