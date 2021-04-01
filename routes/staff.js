const express = require('express');
const router = express.Router({mergeParams:true});
const Staff = require('../models/staff');
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');
const staff = require('../controllers/staff');
const {isLoggedIn, isAdmin} = require('../middleware');

router.route('/register')
    .get(staff.renderRegister)
    .post(catchAsync(staff.register));

router.route('/dashboard')
    .get(isLoggedIn, isAdmin, staff.renderDashboard)
    .post(isLoggedIn, isAdmin, staff.registerACandidate);

router.route('/dashboard/new-staff')
    .get(isLoggedIn, isAdmin, staff.renderNewStaff)
    .post(isLoggedIn, isAdmin, staff.createNewStaff);

router.route('/dashboard/candidate/new')
    .get(isLoggedIn, isAdmin, staff.renderNewCandidate);

router.route('/dashboard/candidate/:id')
    .put(isLoggedIn, isAdmin, catchAsync(staff.updateCandidate))
    .delete(isLoggedIn, isAdmin, catchAsync(staff.deleteCandidate));

router.route('/dashboard/update-staff/:id')
    .put(isLoggedIn, isAdmin, catchAsync(staff.updateStaff))
    .delete(isLoggedIn, isAdmin, catchAsync(staff.deleteStaff));

// router.route('/dashboard/exams/:id/questions')
//     .post(isLoggedIn, catchAsync(staff.createQuestion));

router.route('/login')
    .get(staff.renderLogin)
    .post(passport.authenticate('local', {failureFlash:true, failureRedirect:'/staff/login'}), staff.login)

router.get('/logout', staff.logout);

module.exports = router;