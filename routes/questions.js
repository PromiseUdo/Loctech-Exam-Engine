const express = require('express');
const router = express.Router({mergeParams:true});
const Staff = require('../models/staff');
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');
const staff = require('../controllers/staff');
const question = require('../controllers/questions');
const {isLoggedIn, isAdmin} = require('../middleware');

router.route('/')
    .post(isLoggedIn, isAdmin,  catchAsync(question.createQuestion));

router.route('/:id')
    .put(isLoggedIn, isAdmin,  catchAsync(question.updateQuestion))
    .delete(isLoggedIn, isAdmin,  catchAsync(question.deleteQuestion));

module.exports = router