const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class UserController {

    static async registerUser(req, res) {
        try {
            const InputUsers = await User.create(req.body);
            const dataView = {
                email: InputUsers.email,
                full_name: InputUsers.full_name,
                username: InputUsers.username,
                profile_image_url: InputUsers.profile_image_url,
                age: InputUsers.age,
                phone_number: InputUsers.phone_number,
            }
            res.status(201).json({ user: dataView });
        } catch (error) {
            if (error.name == 'SequelizeValidationError') {
                return res.status(422).json({
                    status: 'fail',
                    errors: error.errors.map(e => e.message)
                })
            }
            if (error.name == 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    status: 'fail',
                    errors: error.errors.map(e => e.message)
                })
            }
            res.status(500).json({ status: 'fail', message: 'Internal server error' });
        }
    }

    static async loginUser(req, res) {
        try {
            const data = await User.findOne({
                where: {
                    email: req.body.email,
                },
            });

            if (!data) {
                res.status(400).json({
                    status: 'fail',
                    message: "Email Is Incorrect",
                });
            } else {
                if (comparePassword(req.body.password, data.password)) {
                    const access_token = signToken({
                        id: data.id,
                        email: data.email,
                        username: data.username,
                    });
                    res.status(200).json({ token: access_token });
                } else {
                    res.status(400).json({
                        status: 'fail',
                        message: "Password Is Incorrect",
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                status: 'fail',
                message: 'Internal server error'
            });
        }
    }
    static async updateUser(req, res) {
        try {
            const id = +req.params.userId
            const InputUsers = await User.update(req.body, { where: { id }, returning: true });
            const dataView = {
                email: InputUsers[1][0].email,
                full_name: InputUsers[1][0].full_name,
                username: InputUsers[1][0].username,
                profile_image_url: InputUsers[1][0].profile_image_url,
                age: InputUsers[1][0].age,
                phone_number: InputUsers[1][0].phone_number,
            }
            res.status(200).json({ user: dataView });
        } catch (error) {
            if (error.name == 'SequelizeValidationError') {
                return res.status(422).json({
                    status: 'fail',
                    errors: error.errors.map(e => e.message)
                })
            }
            if (error.name == 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    status: 'fail',
                    errors: error.errors.map(e => e.message)
                })
            }
            res.status(500).json({ status: 'fail', message: 'Internal server error' });
        }
    }
    static async delUser(req, res) {
        try {
            const userId = req.params.userId
            User.destroy({
                where: {
                    id: userId
                },
            });
            res.status(200).json({ message: "Your account has been successfully deleted" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = UserController;
