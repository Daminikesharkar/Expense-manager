const express = require('express');
const premiumMembershipPurchace = require('../controllers/premiumMembership')
const authentication = require('../middleware/authenticate');

const router = express.Router();

//premium membership purchase routes
router.get('/buyPremium',authentication.authenticate,premiumMembershipPurchace.purchasePremiumMembership);
router.post('/updateTransaction',authentication.authenticate,premiumMembershipPurchace.updateTransaction);

module.exports = router;