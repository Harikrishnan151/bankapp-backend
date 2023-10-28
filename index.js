//Backend for Bank app

//Create server application using express
//1) import express
    const express= require('express');

//4) import cors
    const cors=require('cors')
    const logic = require('./services/logic')
 
//import jsonwebtoken
const jwt = require('jsonwebtoken')

//2) create a server application server
    const server = express()


 //5) use cors
     server.use(cors({
    origin:'http://localhost:4200'
    }))
    server.use(express.json())//returns middleware that only parse json

 //3) setup port for server application

    server.listen(5000,()=>{
    console.log('server listening on port 5000');
   })
 
 //Api call to resolve - localhost/5000
//     server.get('/',(req,res)=>{
//     res.send('welcome to backend')
//     })
//     server.post('/',(req,res)=>{
//     console.log('server post'); 

// })

//Application level middleware
//    const appMiddleware =(req,res,next)=>{
//       console.log('Application level middleware');
//       next();
//    }

//  server.use(appMiddleware)

//Routerlevel middle ware
const jwtMiddleware=(req,res,next)=>{
   console.log('Router level middle ware');
   try{
      const token= req.headers['verify-token']
   console.log(token);
   const data=jwt.verify(token,'superkey2023')
   console.log(data);
   req.currentAcno=data.loginAcno
   next()
   }
   catch{
      res.status(401).json({message:'please Login'})
   }
  
}

//Api calls 
//register- localhost:5000/register
server.post('/register',(req,res)=>{
   console.log('inside register API call');
   console.log(req.body);
  
// //logic to resolve register request
   logic.register(req.body.username,req.body.acno,req.body.password).then((response)=>{
      res.status(response.statusCode).json(response)
   }) 
})

//login 
server.post('/login',(req,res)=>{
   console.log('inside login API call');
   console.log(req.body);

   logic.login(req.body.acno,req.body.password).then((response)=>{
      res.status(response.statusCode).json(response)
   })
})
// balance -localhost:500/getbalance
server.get('/getbalance/:acno',jwtMiddleware,(req,res)=>{
   console.log('inside getbalance API call');
   console.log(req.params);//http://localhost:5000/getbalance/100
  logic.getbalance(req.params.acno).then((response)=>{
   res.status(response.statusCode).json(response)
  })

})


//fundtransfer
server.post('/fundtransfer',jwtMiddleware,(req,res)=>{
   console.log('inside funtransfer Api call');
   console.log(req.body);
   logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then((response)=>{
      res.status(express.response.statusCode).json(response)
   })
})
//transactions

server.get('/transactions',jwtMiddleware,(req,res)=>{
   console.log('inside trasaction api');
   logic.transactionHistory(req.currentAcno).then((response)=>{
      res.status(response.statusCode).json(response)
   })
})

//delete account
server.delete('/deleteAccount',jwtMiddleware,(req,res)=>{
   console.log('Inside delete API');
   logic.deleteAccount(req.currentAcno).then((response)=>{
      res.status(response.statusCode).json(response)
   })
})