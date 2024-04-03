const express = require('express');
const premiumMembershipPurchace = require('../controllers/premiumMembership')
const authentication = require('../middleware/authenticate');
const premiumMembershipFeatures = require('../controllers/premiumFeatures');

const router = express.Router();

//premium membership purchase routes
router.get('/premium',premiumMembershipPurchace.getPremiumPage);
router.get('/buyPremium',authentication.authenticate,premiumMembershipPurchace.purchasePremiumMembership);
router.post('/updateTransaction',authentication.authenticate,premiumMembershipPurchace.updateTransaction);

//premium membership features routes
router.get('/showLeaderboard',authentication.authenticate,premiumMembershipFeatures.showLeaderboard);

module.exports = router;