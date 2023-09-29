const router = require("express").Router();
const photoUpload = require("../middlewares/photoUpload");

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  profilePhotoUploadCtrl,
} = require("../Controllers/userController");

const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyUserAccountCtrl } = require("../Controllers/authController");

// /api/users/profile-photo-upload
router
  .route("/profile-photo-upload")
  .post(
    verifyTokenAndAuthorization,
    photoUpload.single("image"),
    profilePhotoUploadCtrl
  );

// /api/users/:userId/verify/:token
router.get("/:userId/verify/:token", verifyUserAccountCtrl);

// /api/userss
router.route("/").get(verifyTokenAndAdmin, getAllUsers);

// // /api/users/count
// router.route("/count").get(verifyTokenAndAdmin, getUsersCount);

// /api/users/:id
router
  .route("/:id")
  .get(validateObjectId, verifyTokenAndAuthorization, getUser)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUser)
  .delete(validateObjectId, verifyTokenAndAuthorization, deleteUser);

module.exports = router;
