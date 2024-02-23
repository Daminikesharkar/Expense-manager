const express = require('express');

const resetPasswordController = require('../controllers/resetPassword');
const router = express.Router();

//reset password route
router.post('/password/resetpassword',resetPasswordController.resetPassword);


module.exports = router;