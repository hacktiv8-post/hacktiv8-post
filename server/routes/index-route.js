const router = require("express").Router();
const Controller = require("../controllers/controller");

const authenticate = require("../middleware/auth");

router.post("/register", Controller.register);
router.post("/login", Controller.login);

router.post("/google-login", Controller.googleLogin);

router.use(authenticate);

router.post("/dashboard", Controller.dashboard);

module.exports = router;
