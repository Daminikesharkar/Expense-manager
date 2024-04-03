const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Downloads = sequelize.define('downloads',{
    id: {
        type :Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull:false
    },
    downloadUrl:{
        type: Sequelize.STRING(),
        unique:true,
        validate:{isUrl:true},
        notEmpty:true,
        allowNull: false,
    }
})
module.exports=Downloads;