const express = require('express');

const mainController = require('../controllers/main');
const expenseController = require('../controllers/expenses')

const router = express.Router();

router.get('/',mainController.getIndex);
router.get('/addUser',mainController.postUser);
router.get('/login',mainController.login);

router.post('/addExpense',expenseController.addExpense);
router.get('/getExpenses',expenseController.getExpense);
router.get('/deleteExpense/:id',expenseController.getExpense);

module.exports = router;