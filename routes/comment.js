var express = require('express');
var router = express.Router();
const CommentController = require("../controllers/CommentController");
const commentAuthorization = require('../middlewares/comment.authorization');

router.post('/', CommentController.create);
router.get('/', CommentController.comments);
router.put('/:commentId', commentAuthorization, CommentController.updateById);
router.delete('/:commentId', commentAuthorization, CommentController.deleteById);

module.exports = router;