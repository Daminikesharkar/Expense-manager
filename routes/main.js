const express = require('express');

const mainController = require('../controllers/main');

const router = express.Router();

router.get('/',mainController.getIndex);
router.get('/addUser',mainController.postUser);

module.exports = router;