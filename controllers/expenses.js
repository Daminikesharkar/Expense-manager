const Expense = require('../models/expense');
const path = require('path');
const Users = require('../models/user');
const sequelize = require('../util/database');

// const expensePagePath = path.join(__dirname, '../views/addExpense.html');
const expensePagePath = path.join(__dirname, '../views/test2.html');

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

exports.addExpense = async(req, res) => {

    const transaction = await sequelize.transaction();

    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;

    console.log("In",amount)

    Expense.create({
        amount: amount,
        description: description,
        category: category,
        userId: req.user.id

    },{transaction})
    .then((createdExpense)=>{
        if (createdExpense) {
            const total_expenses = Number(req.user.totalExpense) + Number(amount);

            Users.update({totalExpense:total_expenses},{where:{id:req.user.id}, transaction })
            .then(async()=>{
                await transaction.commit();
            })
            .catch(async (err)=>{
                if (transaction) {
                    await transaction.rollback();
                }
                console.log(err);
            })
            
            return res.status(201).json({
                message: 'Expense added successfully',
                expense: createdExpense
            });
        }
    })
    .catch(async()=>{
        console.log(err);
        if (transaction) {
            await transaction.rollback();
        }
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