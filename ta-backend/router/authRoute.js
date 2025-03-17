const {
  signup,
  login,
  logout,
  refreshToken,
  sendOtp,
  verifyOtp,
  getInfo,
} = require("../controller/authController");
const authMiddleware = require("../middleware/authMIddleware");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/logout", authMiddleware, logout);
router.post("/refresh-access-token", refreshToken);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/info", authMiddleware, getInfo);

module.exports = router;
