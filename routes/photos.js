var express = require('express');
var router = express.Router();
const PhotoController = require("../controllers/photo");
const authorizationPhoto = require('../middlewares/authorizationPhoto');


router.post('/', PhotoController.CreatePhoto);
router.get('/', PhotoController.GetPhotos);

router.put('/:photoId', authorizationPhoto, PhotoController.EditPhoto);
router.delete('/:photoId', authorizationPhoto, PhotoController.delPhoto);


module.exports = router;