/**
 * @file recieves' incoming client request concerning user and
 * processing the data and resources solving business problems
 * @author Ayoyimika <ajibadeayoyimika@gmail.com> <16/03/2021 1:37am>
 * @since 0.1.0
 * Last Modified: Ayoyimika <ajibadeayoyimika@gmail.com> <16/03/2021 1:37am>
 */

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // Create an error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword'
      )
    );
  }
  // 2) Filtered out unwanted user that are not allowed to be in the data
  const filterdBody = filterObj(req.body, 'name', 'email');
  if (req.file) filterdBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: "This route is not defined. Pleas use '/signup' route",
  });
};

exports.getUser = catchAsync(async (req, res, next) => {
  user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No User found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError('No User found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No User found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
