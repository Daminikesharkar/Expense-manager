const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Expense = sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        allownull:false,
        autoIncrement:true,
        primaryKey:true
    },
    amount:{
        type:Sequelize.INTEGER,
        allownull:false,
    },
    description:{
        type:Sequelize.STRING,
        allownull:false,
    },
    category:{
        type:Sequelize.STRING,
        allownull:false,
    }
});

module.exports = Expense;