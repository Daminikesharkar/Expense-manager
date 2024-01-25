const express = require('express');

const mainController = require('../controllers/main');
const expenseController = require('../controllers/expenses');
const authentication = require('../middleware/authenticate');

const router = express.Router();

//User routes
router.get('/',mainController.getIndex);
router.get('/loginPage',mainController.loginPage);
router.get('/signupPage',mainController.signUpPage);
router.post('/addUser',mainController.postUser);
router.post('/login',mainController.login);

//Expense routes
router.get('/userExpenses',expenseController.showExpensePage)
router.post('/addExpense',authentication.authenticate,expenseController.addExpense);
router.get('/getExpenses',authentication.authenticate,expenseController.getExpense);
router.get('/deleteExpense/:id',authentication.authenticate,expenseController.deleteExpense);

module.exports = router;