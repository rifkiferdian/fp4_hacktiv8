var express = require('express');
var router = express.Router();
const UserController = require("../controllers/user");
const authentication = require('../middlewares/authentication');
const authorizationUser = require('../middlewares/authorizationUser');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

router.use(authentication);
router.put('/:userId', authorizationUser, UserController.updateUser);
router.delete('/:userId', authorizationUser, UserController.delUser);


module.exports = router;