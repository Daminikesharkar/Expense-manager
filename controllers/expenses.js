const Expense = require('../models/expense');
const Users = require('../models/user');
const sequelize = require('../util/database');

exports.showExpensePage = (req,res)=>{
    res.sendFile('addExpense.html', { root: 'views' });
}

exports.getExpense = async (req,res)=>{
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = 2;

    try {
        const totalItems = await Expense.count({ where: { userId: req.user.id } });
        
        const expenses = await Expense.findAll({
            where: { userId: req.user.id },
            offset: (page - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE
        });
        
        return res.status(200).json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error getting all products' });
    }
}

exports.addExpense = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { amount, description, category } = req.body;

        const createdExpense = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id
        }, { transaction });

        if (createdExpense) {
            const total_expenses = Number(req.user.totalExpense) + Number(amount);

            await Users.update({ totalExpense: total_expenses }, { where: { id: req.user.id }, transaction });

            await transaction.commit();

            return res.status(200).json({
                message: 'Expense added successfully',
                expense: createdExpense
            });
        }
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }

        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.deleteExpense = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const id = req.params.id;
        const expense = await Expense.findByPk(id);

        const newTotalExpense = Number(req.user.totalExpense) - Number(expense.amount);
        await Users.update({ totalExpense: newTotalExpense }, { where: { id: req.user.id }, transaction });

        await expense.destroy({ transaction });
        await transaction.commit();

        return res.json({ message: 'Expense deleted successfully', totalExpense: newTotalExpense });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: 'Error deleting expense' });
    }
};
