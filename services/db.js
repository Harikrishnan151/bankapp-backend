//Mongodb connection withn js

//1 connection library - mongoos - npm i mongoose

//import mongoose
const mongoose = require('mongoose')

//2 Define connection string
mongoose.connect('mongodb://localhost:27017/BankApp')

//3 create a model and schema for storing data
const User=mongoose.model('User',{
    username:String,
    acno:Number,
    password:String,
    balance:Number,
    transaction:[]
})

module.exports={
    User
}
