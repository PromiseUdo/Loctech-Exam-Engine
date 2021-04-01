const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const candidateSchema = new mongoose.Schema({
    email:{
        type:String,
        required: "Please enter candidate's email"
    },
    course:{
        type:String,
        required:"Please enter candidate's course"
    },
    phone:{
        type:String,
        required:"Please enter candidate's phone number"
    },
    passcode:{
        type:String
    }
});

candidateSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Candidate', candidateSchema);