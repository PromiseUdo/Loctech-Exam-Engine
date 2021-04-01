const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


//create a staff schema
const userSchema = new Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    course:{
        type:String
    },
    phone:{
        type:String
    },
    passcode:{
        type:String
    },
    role:{
        type:String  
    }
});

//will add on fields for username and password, makes them unique and give us additional methods to use
userSchema.plugin(passportLocalMongoose);


//compile and export
module.exports = mongoose.model('User', userSchema);