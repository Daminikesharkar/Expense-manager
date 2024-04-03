const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
// const indexFilePath = path.join(__dirname, '../views/index.html');

const indexFilePath = path.join(__dirname, '../views/test.html');

const Users = require('../models/user');

exports.getIndex = (req, res) => {
    res.sendFile(indexFilePath);
};

exports.loginPage = (req,res)=>{
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
}

exports.signUpPage = (req,res)=>{
    res.sendFile(path.join(__dirname, '../views', 'signUp.html'));
}

exports.postUser = (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }

        Users.findOne({ where: { email: email } })
            .then(existingUser => {
                if (existingUser) {
                    return res.status(400).json({
                        message: 'User already exists with this email address'
                    });
                }

                return Users.create({
                    username: username,
                    email: email,
                    password: hashedPassword 
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
    });
};

exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    Users.findOne({ where: { email: email } })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, passwordMatch) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            error: 'Internal Server Error'
                        });
                    }

                    if (passwordMatch) {
                        const token = jwt.sign({ userId: user.id, ispremiumuser: user.ispremiumuser }, 'secretKey', { expiresIn: '1h' });
                        res.status(200).json({
                            message: 'User login successful',
                            token: token,
                            user: user
                        });
                    } else {
                        res.status(401).json({
                            message: 'User not authorized'
                        });
                    }
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
};
