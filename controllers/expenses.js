const Expense = require('../models/expense');
const path = require('path');

const expensePagePath = path.join(__dirname, '../views/addExpense.html');
let currentUserId;

exports.showExpensePage = (req,res)=>{
    res.sendFile(expensePagePath);
    console.log(req.query.userId)
    currentUserId = req.query.userId;
}


exports.getExpense = (req,res)=>{
    console.log(currentUserId)
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

    Expense.create({
        amount: amount,
        description: description,
        category: category,
        userId: currentUserId

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