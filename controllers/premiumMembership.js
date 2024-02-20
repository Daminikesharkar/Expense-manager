const Razorpay = require('razorpay');
const Order = require('../models/order');
const key_id = "rzp_test_hZ745IA6GAHJWc";
const key_secret = "6183w3iLaSB1wFJftiQTRkww";

exports.purchasePremiumMembership = async(req,res)=>{
    console.log("Inside")

    try {
        var rzp = new Razorpay({
            key_id: key_id,
            key_secret:key_secret
        })
            
        console.log("Inside2",rzp);

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
                console.log(err);
            })
        })
        
    } catch (error) {
        console.log(error)
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
            return res.status(200).json({ success: true, msg: "Transaction Successful" });
        }).catch((err)=>{
            console.log(err);
        })       
                
    } catch (error) {
        console.log(error)
    }
}
