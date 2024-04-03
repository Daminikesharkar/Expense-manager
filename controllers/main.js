const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
// const indexFilePath = path.join(__dirname, '../views/index.html');

const indexFilePath = path.join(__dirname, '../views/test.html');

const Users = require('../models/user');

exports.getIndex = (req, res) => {
    res.sendFile(indexFilePath);
};

exports.postUser = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await Users.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email address'
            });
        }

        const createdUser = await Users.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        if (createdUser) {
            return res.status(201).json({
                message: 'User added successfully',
                user: createdUser
            });
        }
    } catch (err) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await Users.findOne({ where: { email: email } });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign({ userId: user.id, ispremiumuser: user.ispremiumuser }, process.env.SECRETKEY, { expiresIn: '1h' });
                res.status(200).json({
                    message: 'User logged in successfully',
                    token: token,
                    user: user
                });
            } else {
                res.status(401).json({
                    message: "Password doesn't match, please try again"
                });
            }
        } else {
            res.status(400).json({
                message: "Email address is not registered please signUp first"
            });
        }
    } catch (err) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};
