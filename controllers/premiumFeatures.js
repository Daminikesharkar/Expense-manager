const AWS = require('aws-sdk');

const Users = require('../models/user');
const Expense = require('../models/expense');
const downloads = require('../models/download');

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

function uploadtoS3(data,filename){
  const bucketName = process.env.BUCKET_NAME;
  const iamUserKey = process.env.IAM_USER_KEY;
  const iamUserSecret = process.env.IAM_USER_SECRET;

  return new Promise((resolve,reject)=>{
      const s3bucket = new AWS.S3({
          accessKeyId: iamUserKey,
          secretAccessKey: iamUserSecret,
      });
  
      const params = {
          Bucket: bucketName,
          Key: filename,
          Body:data,
          ACL: 'public-read'
      }
  
      s3bucket.upload(params,(err,s3response)=>{
          if(err){
              console.log("Something went wrong",err);
              reject(err);
          }else{
              console.log('Success',s3response);
              resolve(s3response.Location);
          }
      });
  })   
}

exports.downloadFile = async(req,res)=>{
  try {
      const products = await Expense.findAll({where: {
          userId: req.user.id,
      }});
           
      const stringifiedProducts = JSON.stringify(products);
      const filename = `Products${req.user.id}/${new Date()}.txt`;

      const fileurl = await uploadtoS3(stringifiedProducts,filename);
      console.log(fileurl);

      const newUrl = await downloads.create({
          downloadUrl:fileurl,
          userId:req.user.id
      })

      return res.status(200).json({
          fileurl: fileurl,
      })

  } catch (error) {
      res.status(500).json({fileurl: '',error: 'Error getting all products'});
  }    
}

exports.downloadedHistory = async (req,res)=>{
  try {
      const history = await downloads.findAll({where:{userId:req.user.id}});

      return res.status(200).json({
          history: history
      })
      
  } catch (error) {
      res.status(500).json({error: 'Error getting all products'});
  }
}