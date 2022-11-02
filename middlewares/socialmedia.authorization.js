const AuthorizationError = require('../exceptions/AuthorizationError');
const ClientError = require('../exceptions/ClientError');
const { SocialMedia } = require('../models');

const socialmediaAuthorization  = async (req, res, next) => {
    try {
        const UserId = +res.locals.user.id;
        const id = +req.params.socialMediaId;
        const socialMedia = await SocialMedia.findByPk(id);
        if(!socialMedia) {
            throw new AuthorizationError('Social Media tidak ditemukan ...!');
        }        
        if(socialMedia.UserId !== UserId) {
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

module.exports = socialmediaAuthorization;