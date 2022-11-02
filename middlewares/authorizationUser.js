const { User } = require("../models");

const authorizationUser = async (req, res, next) => {
    try {
        const id_login = res.locals.user.id
        const userId = req.params.userId
        const result = await User.findByPk(userId);
        if(!result) {
            return res.status(404).json({
                status: 'fail',
                message:'User not found...!'
            })
        }

        if(result.id !== id_login){
            return res.status(401).json({
                status: 'fail',
                message:'Access Denied...!'
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Internal Server Error'
        })
    }
}

module.exports = authorizationUser;