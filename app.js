const express = require('express');
const path = require('path');
const cors = require('cors');

const mainRoutes = require('./routes/main');
const premiumRoutes = require('./routes/premium')
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');

const app = express();

app.use(express.urlencoded({extended: false }));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());

User.hasMany(Expense);
Expense.belongsTo(User,{constraints:true, onDelete:'CASCADE'});

User.hasMany(Order);
Order.belongsTo(User,{constraints:true, onDelete:'CASCADE'})

sequelize.sync();

app.use(mainRoutes);
app.use(premiumRoutes);

app.use(cors());

app.listen(3000,()=>{
    console.log('server is live on port 3000')
})
