const Expense = require('../models/appointment');

exports.getExpense = (req,res)=>{

    Expense.findAll()
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
        category: category 

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
    Books.findByPk(req.params.id)
    .then((expense)=>{
        return expense.destroy();
    })
    .catch((err)=>{
        console.log(err);
    })
}