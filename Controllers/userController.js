const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

/**-----------------------------------------------
 * @desc    Get All Users Profile
 * @route   /api/users
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({ users, count: users.length });
});

/**-----------------------------------------------
 * @desc    Get User Profile
 * @route   /api/users/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  res.status(200).json(user);
});

/**-----------------------------------------------
 * @desc    Update User Profile
 * @route   /api/users/:id
 * @method  PUT
 * @access  private (only user himself)
 ------------------------------------------------*/
module.exports.updateUser = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select("-password");

  res.status(200).json(updatedUser);
});

// /**-----------------------------------------------
//  * @desc    Get Users Count
//  * @route   /api/users/count
//  * @method  GET
//  * @access  private (only admin)
//  ------------------------------------------------*/
// module.exports.getUsersCount = asyncHandler(async (req, res) => {
//   const count = await User.count();
//   res.status(200).json({count});
// });

/**-----------------------------------------------
 * @desc    Delete User Profile (Account)
 * @route   /api/users/profile/:id
 * @method  DELETE
 * @access  private (only admin or user himself)
 ------------------------------------------------*/
module.exports.deleteUser = asyncHandler(async (req, res) => {
  // 1. Get the user from DB
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  // 2. Delete the user
  await User.findByIdAndDelete(req.params.id);

  // 3. Send a response to the client
  res.status(200).json({ message: "your profile has been deleted" });
});

/**-----------------------------------------------
 * @desc    Profile Photo Upload
 * @route   /api/users/profile/profile-photo-upload
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // 1. Validation
  if (!req.file) {
    return res.status(400).json({ message: "no file provided" });
  }

  // 2. Get the path to the image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // 3. Get the user from DB
  const user = await User.findById(req.user.id);

  // 4. get old url
  const oldUrl = user.profilePhoto.url;
  console.log(oldUrl);

  // 5. Change the profilePhoto field in the DB
  user.profilePhoto = {
    url: imagePath,
  };
  await user.save();

  if (oldUrl) {
    try {
      const image = fs.readFileSync(oldUrl);
      if (image) fs.unlinkSync(oldUrl);
    } catch (error) {}
  }

  // 7. Send response to client
  res.status(200).json({
    message: "your profile photo uploaded successfully",
    profilePhoto: { url: imagePath },
  });
});
