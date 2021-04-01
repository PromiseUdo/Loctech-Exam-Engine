const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utilities/catchAsync');
const candidate = require('../controllers/candidates');
const result = require('../controllers/results');
const {isLoggedIn} = require('../middleware');
const passport = require('passport');

router.route('/')
    .post(result.getResponses);



module.exports = router;
