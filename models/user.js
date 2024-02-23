const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Users = sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        allownull:false,
        autoIncrement:true,
        primaryKey:true
    },
    username:{
        type:Sequelize.STRING,
        allownull:false,
    },
    email:{
        type:Sequelize.STRING,
        allownull:false,
    },
    password:{
        type:Sequelize.STRING,
        allownull:false,
    },
    ispremiumuser:{
        type: Sequelize.BOOLEAN,
        defaultValue:false,
    },
    totalExpense:{
        type: Sequelize.INTEGER,
        defaultValue:0,
    }
});

module.exports = Users;