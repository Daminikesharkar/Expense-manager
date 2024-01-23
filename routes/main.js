const express = require('express');

const mainController = require('../controllers/main');
const expenseController = require('../controllers/expenses')

const router = express.Router();

router.get('/',mainController.getIndex);
router.get('/loginPage',mainController.loginPage);
router.get('/signupPage',mainController.signUpPage);

router.post('/addUser',mainController.postUser);
router.post('/login',mainController.login);

router.get('/userExpenses',expenseController.showExpensePage)
router.post('/addExpense',expenseController.addExpense);
router.get('/getExpenses',expenseController.getExpense);
router.get('/deleteExpense/:id',expenseController.deleteExpense);

module.exports = router;