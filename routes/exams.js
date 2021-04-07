const express = require('express');
const router = express.Router({mergeParams:true});
const Staff = require('../models/staff');
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');
const exam = require('../controllers/exams');
const result = require('../controllers/results');
const {isLoggedIn, isAdmin, isOwner} = require('../middleware');

router.route('/')
    .get(isLoggedIn, isAdmin, catchAsync(exam.renderExamIndex))
    .post(isLoggedIn, catchAsync(exam.createNewExam));


router.route('/results')
    .get(isLoggedIn, isAdmin, catchAsync(result.renderResultIndex));

router.route('/:resultId/detail')
    .get(isLoggedIn, isAdmin, catchAsync(result.renderResultDetail));

router.route('/:id')
    .get(isLoggedIn, isAdmin, catchAsync(exam.showExamDetails))
    .put(isLoggedIn, isAdmin, catchAsync(exam.updateExam))
    .delete(isLoggedIn, isAdmin, catchAsync(exam.deleteExam));


    
module.exports = router;