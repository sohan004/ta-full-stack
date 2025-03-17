const router = require("express").Router();

router.use("/auth", require("./authRoute"));
router.use("/note", require("./noteRoute"));

module.exports = router;
