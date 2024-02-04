const Razorpay = require('razorpay')
const key_id = 'rzp_test_lmIdbBMaVqEVXQ';
const key_secret = 'Au1P7pT2Vbu7Ffm67KP4spxM';

exports.purchasePremiumMembership = (req,res)=>{
    const razorpayInstance = new Razorpay({
        key_id: key_id,
        key_secret:key_secret        
    })

    const amount = 1000;
    const options = {
        amount:amount,
        currency: 'INR',
    }

    razorpayInstance.orders.create(options,(err,order)=>{
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }else{
            res.json({ orderId: order.id, amount: order.amount, key_id: key_id });
        }      
    })
}



