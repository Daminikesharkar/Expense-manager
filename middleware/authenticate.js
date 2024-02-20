const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = (request,response,next)=>{
    try {
        const token = request.header('Authorization');
        console.log("TC",token);
        const user = jwt.verify(token,'secretKey')
        console.log(user);
        User.findByPk(user.userId)
        .then((user)=>{
            console.log(user);
            request.user = user;
            next();
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: 'User not present'
            });
        }) 

    } catch (err) {
        response.status(500).json({ message: 'Internal Server Error - please login again' });

    }
}