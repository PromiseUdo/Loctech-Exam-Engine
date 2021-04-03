const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utilities/catchAsync');
const candidate = require('../controllers/candidates');
const {isLoggedIn} = require('../middleware');
const passport = require('passport');



router.route('/login')
    .get(candidate.renderLogin)
    .post(passport.authenticate('local', {failureFlash:true, failureRedirect:'/candidate/login'}), candidate.login);

router.route('/index')
    .get(isLoggedIn, candidate.renderIndex);

router.route('/getquestion')
    .get(isLoggedIn, candidate.getQuestion);


router.route('/exam/:id/instructions')
    .get(isLoggedIn, candidate.renderInstructions);

router.route('/exam/:id/running')
    .get(isLoggedIn, candidate.renderExam);

router.route('/thankyou')
    .get(candidate.renderThankYou);


// router.get('/staff/dashboard', isLoggedIn, candidates.renderDashboard);

// router.route('/exam/axios')
//     .post(candidate.axiosData);
// router.post('/staff/dashboard/candidate/new', isLoggedIn, candidates.registerACandidate);

module.exports = router;