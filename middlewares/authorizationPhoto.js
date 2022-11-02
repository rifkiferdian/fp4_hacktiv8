const { Photo } = require("../models");

const authorizationPhoto = async (req, res, next) => {
    try {
        const id_login = res.locals.user.id
        const id = req.params.photoId
        const result = await Photo.findByPk(id);
        if(!result) {
            return res.status(404).json({message:'Id not found...!'})
        }

        if(result.UserId !== id_login){
            return res.status(401).json({message:'Access Denied...!'})
        }
        next();
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = authorizationPhoto;