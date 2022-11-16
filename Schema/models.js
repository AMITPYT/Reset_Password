const mongoose = require("mongoose");  
// const validator = require("validator");
const { Schema } = mongoose;

const InfoSchema = new Schema({
    fname:{
        type: String,
        requried: true
    },
    lname:{
        type: String,
        requried: true
        
    },
    email:{
        type: String,
        unique: [true, "Email is already present"],
        requried: true,
    },
    phone:{
        type: Number,
        unique: true,
        minlength: 10,
        requried: true
    },
    password:{
        type: String,Number,
        minlength: 6,
        requried: true
    },
    cpassword:{
        type: String,Number,
        minlength: 6,
        requried: true
    }

})

const PersonData = new mongoose.model('Info', InfoSchema );
module.exports = PersonData;