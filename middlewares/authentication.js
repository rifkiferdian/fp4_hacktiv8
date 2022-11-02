const { verifyToken } = require("../helpers/jwt");

const authentication = async (req, res, next) => {
    try {
        const token = req.headers['token'];
        if(!token) {
            return res.status(401).json({message:'Need Token'})
        }else{
            const result = verifyToken(token);
            res.locals.user = result
            next()
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = authentication;