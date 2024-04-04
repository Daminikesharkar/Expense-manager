const Razorpay = require('razorpay');
require('dotenv').config();

const Order = require('../models/order');
const jwt = require('jsonwebtoken')
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;
const path = require('path');

const premiumFilePath = path.join(__dirname, '../views/premiumFeatures.html');

exports.getPremiumPage= (req, res) => {
    res.sendFile(premiumFilePath);
};

exports.purchasePremiumMembership = async(req,res)=>{

    try {
        var rzp = new Razorpay({
            key_id: key_id,
            key_secret:key_secret
        })

        var options = {
            amount: 100000,
            currency: "INR",
        };
        
        rzp.orders.create(options,(err,order)=>{
            if(err){
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });  
            }
            req.user.createOrder({
                orderId: order.id,
                status: "PENDING",
            }).then(()=>{
                return res.status(200).json({ orderId: order.id, amount: order.amount, key_id: key_id });
            }).catch((err)=>{
                console.error("Error creating order", err.message);
            })
        })
        
    } catch (error) {
        console.error("Error buying premium", error.message);
    }
}

exports.updateTransaction = async(req,res) =>{
    try {
        const { order_id, payment_id } = req.body;
 
        const order = await Order.findOne({where:{orderId:order_id}})
        const promise1 = order.update({paymentId:payment_id,status:"SUCCESSFUL"})
        const promise2 = req.user.update({ispremiumuser:true})

        Promise.all([
            promise1,
            promise2
        ]).then(()=>{
            return res.status(200).json({ success: true, msg: "Transaction Successful" ,
                                        token:jwt.sign({ userId: req.user.id, ispremiumuser: true }, process.env.SECRETKEY, { expiresIn: '1h' })});
        }).catch((err)=>{
            console.error("Error updating transaction", err.message);
        })       
                
    } catch (error) {
        console.error("Error updating transaction", error.message);
    }
}
