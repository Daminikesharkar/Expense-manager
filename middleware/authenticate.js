const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async (request, response, next) => {
    try {
        const token = request.header('Authorization');
        const user = jwt.verify(token, process.env.SECRETKEY);
        const foundUser = await User.findByPk(user.userId);

        if (foundUser) {
            request.user = foundUser;
            next();
        } else {
            response.status(500).json({
                error: 'User not present'
            });
        }
    } catch (err) {
        response.status(500).json({ message: 'Internal Server Error - please login again' });
    }
}