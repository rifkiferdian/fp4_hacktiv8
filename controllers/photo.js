const { Photo, User, Comment } = require("../models");

class PhotoController {

    static async CreatePhoto(req, res){
        const userId = res.locals.user.id
        const {title, caption, poster_image_url} = req.body
        const dataInput = {
            title: title,
            caption: caption,
            poster_image_url: poster_image_url,
            UserId: userId
        }

        try {
            const result = await Photo.create(dataInput);
            const dataView = {
                id: result.id,
                poster_image_url: result.poster_image_url,
                title: result.title,
                caption: result.caption,
                UserId: result.UserId,
            }
            res.status(201).json(dataView);
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                return res.status(422).json({
                    status : 'fail',
                    errors : error.errors.map(e => e.message)
                })
            }
            res.status(500).json({
                status: 'fail',
                message: 'Internal server error'
            });
        }
    }

    static async EditPhoto(req, res){
        const id = req.params.photoId
        const {title, caption, poster_image_url} = req.body
        const dataInput = {
            title: title,
            caption: caption,
            poster_image_url: poster_image_url
        }

        try {
            const result = await Photo.update(dataInput,{
                where: {
                    id: id
                },
                returning: true,
            });
            res.status(201).json({photo:result[1][0]});
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                return res.status(422).json({
                    status : 'fail',
                    errors : error.errors.map(e => e.message)
                })
            }
            res.status(500).json({
                status: 'fail',
                message: 'Internal server error'
            });
        }
    }
    
    static async GetPhotos(req, res) {
        try {
            const userId = res.locals.user.id
            const data = await Photo.findAll({
                include : [
                    { 
                        model: Comment, 
                        as: 'Comments',
                        attributes: ['comment'],
                        include:[{
                            model: User, 
                            attributes: ['username']
                        }]
                    },
                    { 
                        model: User, 
                        attributes: ['id', 'username','profile_image_url']
                    }
                ],
            });
            if (!data) {
                res.status(400).json({
                    error: "Photo not found",
                });
            }else {
                res.status(200).json({photos:data});
            }

        } catch (error) {
            res.status(500).json({message:error.message});
        }
    }

    static async delPhoto(req, res) {
        try {
            const photoId = req.params.photoId
            Photo.destroy({
                where: {
                    id: photoId
                },
            });
            res.status(200).json({message : "Your photo has been successfully deleted"});
        } catch (error) {
            res.status(500).json({message:error.message});
        }
    }

}

module.exports = PhotoController;