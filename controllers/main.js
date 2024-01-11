const path = require('path');
const indexFilePath = path.join(__dirname, '../views/index.html');

const Users = require('../models/appointment');

exports.getIndex = (req, res) => {
    res.sendFile(indexFilePath);
};

exports.postUser = (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    Users.findOne({ email: email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({
                    message: 'User already exists with this email address'
                });
            }

            return Users.create({
                username: username,
                email: email,
                password: password
            });
        })
        .then(createdUser => {
            if (createdUser) {
                return res.status(201).json({
                    message: 'User added successfully',
                    user: createdUser
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Internal Server Error'
            });
        });
};

exports.login = (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    Users.findOne({ email: email, password: password })
        .then(user => {
            if (user) {
                res.status(200).json({
                    message: 'User login successful',
                    user: user
                });
            } else {
                res.status(401).json({
                    message: 'User not authorized'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Internal Server Error'
            });
        });
}