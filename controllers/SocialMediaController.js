const { SocialMedia, User } = require('../models');
const ClientError = require('../exceptions/ClientError');
class SocialMediaController {
  static async create(req, res) {
    try {
      const UserId = +res.locals.user.id;
      const { name, social_media_url } = req.body;
      const result = await SocialMedia.create({ UserId, name, social_media_url });
      return res.status(201).json({
        social_media: result
      });
    } catch (error) {
      if (error.name == 'SequelizeValidationError') {
        return res.status(422).json({
          status: 'fail',
          errors: error.errors.map(e => e.message)
        });
      }
      console.error(e);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error'
      });
    }
  }
  static async socialmedias(req, res) {
    const social_medias = await SocialMedia.findAll({
      include: [
        { model: User, required: true, attributes:[
          'id', 'username', 'profile_image_url'
        ] },
      ]
    });
    return res.status(200).json({
      social_medias
    });
  }
  static async updateById(req, res) {
    try {
      const id = +req.params.socialMediaId;
      const { name, social_media_url } = req.body;
      const social_media = await SocialMedia.update({ name, social_media_url }, { where: { id }, returning: true });
      return res.status(200).json({
        social_media: social_media[1][0]
      });

    } catch (error) {
      if (error.name == 'SequelizeValidationError') {
        return res.status(422).json({
          status: 'fail',
          errors: error.errors.map(e => e.message)
        });
      }
      console.error(error);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error'
      });
    }
  }
  static async deleteById(req, res) {
    try {
      const id = +req.params.socialMediaId;
      await SocialMedia.destroy({ where: { id } })
      return res.status(200).json({
        message: 'Your social media has been successfully deleted.'
      });
    } catch (err) {
      console.error(error);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error'
      });
    }
  }
}

module.exports = SocialMediaController;