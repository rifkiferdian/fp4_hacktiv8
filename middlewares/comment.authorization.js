const AuthorizationError = require('../exceptions/AuthorizationError');
const ClientError = require('../exceptions/ClientError');
const { Comment } = require('../models');

const commentAuthorization  = async (req, res, next) => {
    try {
        const UserId = +res.locals.user.id;
        const id = +req.params.commentId;
        const comment = await Comment.findByPk(id);
        if(!comment) {
            throw new AuthorizationError('Comment not found...!');
        }        
        if(comment.UserId !== UserId) {
            throw new AuthorizationError('Access Denied...!');
        }
        next();
    } catch (error) {
        if(error instanceof ClientError) {
            return res.status(error.statusCode).json({
               status: 'fail',
               message: error.message
            });
        }
        return res.status(500).json(error);
    }
}

module.exports = commentAuthorization;