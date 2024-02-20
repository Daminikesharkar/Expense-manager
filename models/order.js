const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Order = sequelize.define('orders',{
    id:{
        type:Sequelize.INTEGER,
        allownull:false,
        autoIncrement:true,
        primaryKey:true
    },
    paymentId:{
        type:Sequelize.STRING,
        allownull:true,
    },
    orderId:{
        type:Sequelize.STRING,
        allownull:false,
    },
    status:{
        type:Sequelize.STRING,
        allownull:false,
    }
});

module.exports = Order;