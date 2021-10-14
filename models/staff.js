const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const Results = require('./result');


//create a staff schema
const userSchema = new Schema({
    email: {
        type:String,
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
    },
    results:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Result'
    }
});

//will add on fields for username and password, makes them unique and give us additional methods to use
userSchema.plugin(passportLocalMongoose);


userSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Results.deleteMany({
            _id:{$in:doc.results}
        })
    }else{
    
    }
});


//compile and export
module.exports = mongoose.model('User', userSchema);