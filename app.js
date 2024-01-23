const express = require('express');
const path = require('path');

const mainRoutes = require('./routes/main');
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');

const app = express();

app.use(express.urlencoded({extended: false }));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());

User.hasMany(Expense);
Expense.belongsTo(User,{constraints:true, onDelete:'CASCADE'});

sequelize.sync({ alter: true });

app.use(mainRoutes);

app.listen(3000,()=>{
    console.log('server is live on port 3000')
})
