const express = require('express');

const passwordController = require('../controllers/password');

const router = express.Router();

router.get('/forgetPasswordpage',passwordController.getforgetPasswordPage);
router.post('/forgetPassword',passwordController.getEmailToSendResetLink);
router.get('/forgetPassword/:id',passwordController.resetPassword);
router.get('/updatePassword/:id',passwordController.updatePassword);

module.exports = router;