const otpMail = require("../emailTemplate/otpMail");
const asyncErrorCatcher = require("../middleware/asyncErrorCatcher");
const { User, Otp } = require("../model");
const {
  generateNewJsonToken,
  verifyToken,
} = require("../utilities/generateNewJsonToken");
const {
  getHashPassword,
  comparePassword,
} = require("../utilities/genHashPassword");
const getOtp = require("../utilities/getOtp");

module.exports.signup = asyncErrorCatcher(async (req, res) => {
  const { name, email, password } = await req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await getHashPassword(password);
  const user = await new User({ name, email, password: hashedPassword }).save();
  res.json({ message: "User registered", success: true });
});

module.exports.sendOtp = asyncErrorCatcher(async (req, res) => {
  const { email } = await req.body;
  const newOtp = getOtp();
  await new Otp({ email, otp: newOtp }).save();
  await otpMail(email, newOtp);
  res.json({ message: "OTP sent", success: true });
});

module.exports.verifyOtp = asyncErrorCatcher(async (req, res) => {
  const { email, otp } = await req.body;
  const otpData = await Otp.findOne({ email, otp });
  if (!otpData) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  await Otp.deleteOne({ email, otp });
  res.json({ message: "OTP verified", success: true });
});

module.exports.login = asyncErrorCatcher(async (req, res) => {
  const { email, password } = await req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = generateNewJsonToken(user._id, "1m");
  const refreshToken = generateNewJsonToken(user._id, "7d");

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    message: "Login successful",
    data: {
      name: user.name,
      email: user.email,
    },
    success: true,
  });
});

module.exports.logout = asyncErrorCatcher(async (req, res) => {
  const refreshToken = await req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  user.refreshToken = "";
  await user.save();

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.json({ message: "Logout successful", success: true });
});

module.exports.refreshToken = asyncErrorCatcher(async (req, res) => {
  const refreshToken = await req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isValidRefreshToken = await verifyToken(refreshToken);
  if (!isValidRefreshToken) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const accessToken = generateNewJsonToken(user._id, "1m");
  const newRefreshToken = generateNewJsonToken(user._id, "7d");

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    message: "Token refreshed",
    success: true,
  });
});

module.exports.getInfo = asyncErrorCatcher(async (req, res) => {
  const id = await req.user.id;
  const user = await User.findById(id).select("-password -refreshToken");
  res.json({ user, success: true });
});
