const Sequelize = require('sequelize');

const sequelize = new Sequelize('expensemanagerdb','root','damini@123',{
    host:'localhost',
    dialect: 'mysql'
})

module.exports = sequelize;