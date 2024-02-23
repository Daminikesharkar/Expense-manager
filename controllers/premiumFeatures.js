const sequelize = require('../util/database');
const Users = require('../models/user');
const Expense = require('../models/expense');

/* SELECT users.username, SUM(expenses.amount) as total_expenses 
FROM users
JOIN expenses ON users.id = expenses.userId
GROUP BY users.id ORDER BY total_expenses desc; */


// exports.showLeaderboard = (req,res)=>{
//     Users.findAll({
//         attributes: [
//           'id',
//           'username',
//           [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'total_expenses']
//         ],
//         include: [
//           {
//             model: Expense,
//             attributes: []
//           }
//         ],
//         group: ['users.id', 'expenses.userId'],
//         order: sequelize.literal('total_expenses DESC')
//       })

//       .then(users => {
//         const userData = users.map(user => ({
//             id: user.id,
//             username: user.username,
//             total_expenses: user.get('total_expenses')
//           }));
//           console.log(userData);
//           return res.json({userData: userData});
//       })
//       .catch(error => {
//         console.error(error);
//       });
// }

exports.showLeaderboard = (req,res)=>{
  Users.findAll({
      attributes: [
        'id',
        'username',
        'totalExpense'
      ],
      order: [['totalExpense', 'DESC']]
    })

    .then(users => {
      const userData = users.map(user => ({
          id: user.id,
          username: user.username,
          total_expenses: user.get('totalExpense')
        }));
        console.log(userData);
        return res.json({userData: userData});
    })
    .catch(error => {
      console.error(error);
    });
}