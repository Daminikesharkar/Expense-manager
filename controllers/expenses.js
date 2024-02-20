const Expense = require('../models/expense');
const path = require('path');

const expensePagePath = path.join(__dirname, '../views/addExpense.html');

exports.showExpensePage = (req,res)=>{
    res.sendFile(expensePagePath);
}

exports.getExpense = (req,res)=>{
    const currentUserId = req.user.id;
    Expense.findAll({where: {
        userId: currentUserId,
      }})
    .then((expenses)=>{
        res.json({expense: expenses});
    })  
    .catch((err)=>{
        console.log(err);
    })
}

exports.addExpense = (req, res) => {

    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;

    console.log("In",amount)

    Expense.create({
        amount: amount,
        description: description,
        category: category,
        // userId: req.user.id

    })
    .then((createdExpense)=>{
        if (createdExpense) {
            return res.status(201).json({
                message: 'Expense added successfully',
                expense: createdExpense
            });
        }
    })
    .catch(()=>{
        console.log(err);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    })    
}

exports.deleteExpense = (req,res)=>{
    console.log("Deleting...",req.params.id)
    Expense.findByPk(req.params.id)
    .then((expense)=>{
        return expense.destroy();
    })
    .catch((err)=>{
        console.log(err);
    })
}