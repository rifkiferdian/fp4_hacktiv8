const { Comment, Photo, User, sequelize } = require('../models');
const ClientError = require('../exceptions/ClientError');
class CommentController {
  static async create(req, res) {
    try {
      const UserId = +res.locals.user.id;
      const comment = req.body.comment;
      const PhotoId = +req.body.PhotoId;
      const result = await Comment.create({ UserId, comment, PhotoId });
      return res.status(201).json({
        comment: result
      });
    } catch (error) {
      if (error.name == 'SequelizeValidationError') {
        return res.status(422).json({
          status: 'fail',
          errors: error.errors.map(e => e.message)
        })
      }
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error'
      });
    }
  }
  static async comments(req, res) {
    const comments = await Comment.findAll({
      include: [
        {
          model: Photo, required: true, attributes: [
            'id', 'title', 'caption', 'poster_image_url'
          ]
        },
        {
          model: User, required: true, attributes: [
            'id', 'username', 'profile_image_url', 'phone_number'
          ]
        },
      ],
    });
    return res.status(200).json({
      comments
    });
  }
  static async updateById(req, res) {
    try {
      const id = +req.params.commentId;
      const { comment } = req.body;
      const result = await Comment.update({ comment }, { where: { id } , returning: true});
      return res.status(200).json({
        comment: result[1][0]
      });

    } catch (error) {
      if (error.name == 'SequelizeValidationError') {
        return res.status(422).json({
          status: 'fail',
          errors: error.errors.map(e => e.message)
        })
      }
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error'
      });
    }
  }
  static async deleteById(req, res) {
    try {
      const id = +req.params.commentId;
      await Comment.destroy({ where: { id } })
      return res.status(200).json({
        message: 'Your comment has been successfully deleted.'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'fail',
        message: err.message
      });
    }
  }
}

module.exports = CommentController;