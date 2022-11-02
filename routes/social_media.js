var express = require('express');
var router = express.Router();
const SocialMediaController = require("../controllers/SocialMediaController");
const socialmediaAuthorization = require('../middlewares/socialmedia.authorization');

router.post('/', SocialMediaController.create);
router.get('/', SocialMediaController.socialmedias);
router.put('/:socialMediaId', socialmediaAuthorization, SocialMediaController.updateById);
router.delete('/:socialMediaId', socialmediaAuthorization, SocialMediaController.deleteById);

module.exports = router;