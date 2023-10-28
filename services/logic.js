
//Import db
const db = require('./db')

//import jsonwebtoken
const jwt = require('jsonwebtoken')
//logic for register

const register=(username,acno,password)=>{
return db.User.findOne({acno}).then((response)=>{
    console.log(response);
    if(response){
        return{
            statusCode:401,
            message:"Account number already registered"
        }
    }else{
        const newUser=new db.User({
            username,
            acno,
            password,
            balance:2000,
            transaction:[]
        })
        //to store the new user in the database
        newUser.save()
        //response send back to the clint
        return{
            statusCode:200,
            message:"Registration Successfull"
        }
    }
})
}
    //logic for Login
 const login=(acno,password)=>{
    return db.User.findOne({acno,password}).then((response)=>{
        console.log(response);//full details
        if(response){
            //token generation
            const token= jwt.sign({
                loginAcno:acno
            },'superkey2023')
            return{
                statusCode:200,
                message:"Login successfull",
               currentUser:response.username, //current user name send to front end
               currentBalance:response.balance,//balance for current user
               token,
               currentAcno:acno
            }
        }else{//acno , password not present in db
              return{
                statusCode:400,
                message:"invalid Login"
              }
        }
    })
 }
//  logic for getting balance
const getbalance=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                balance:result.balance
            }
        }
        else{
            return{
                statusCode:401,
                message:'Invalid acno'
            }
      }
   })
}

//fund transfer
const fundTransfer=(fromAcno,frompswd,toAcno,amt)=>{
    //conver amt in to number
    let amount = parseInt(amt)
    return db.User.findOne({acno:fromAcno,password:frompswd}).then((debit)=>{
        if(debit){
            //check toAcno in mongodb
            return db.User.findOne({acno:toAcno}).then((credit)=>{
                //fund transfer
                if(credit){
                    if(debit.balance>=amount){
                        debit.balance-=amount //debit.balance-amount=debit.balance
                        debit.transaction.push({
                            type:'debit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                    }else{
                        return{
                            statusCode:401,
                            message:'insufficient funds'
                        }
                    }
                    //save changes to database
                    debit.save()

                    credit.balance+=amount
                    credit.transaction.push({
                        type:'credit',
                        amount,
                        fromAcno,
                        toAcno
                    })
                    //save changes to database
                    credit.save()

                    //send response back to client
                    return{
                        statusCode:200,
                        message:'Fund Transfer Successful...'
                    }
                    
                }else{
                    return{
                        statusCode:401,
                        message:'invalid credit details'
                    }
                }
            })
        }else{
            return{
                statusCode:401,
                message:'invalid debit details'
            }
        }
    })
}

//transaction history
const transactionHistory=(acno)=>{
   //to check acno present in mongodb
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                transactions:result.transaction

            }
        }else{
            return{
                statusCode:400,
                message:'invalid data'
            }
        }
    })
}
//delete account
const deleteAccount=(acno)=>{
     return db.User.deleteOne({acno}).then((result)=>{
        return{
            statusCode: 200,
            message:"Account deleted sucesfully"
        }
     })
}
module.exports={
    register,
    login,
    getbalance,
    fundTransfer,
    transactionHistory,
    deleteAccount
}






