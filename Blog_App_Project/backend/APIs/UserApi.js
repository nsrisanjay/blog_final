//import the express module 
const exp=require('express')
//create the mini application
const UserApp=exp.Router()
//import the bcrypt
const bcryptjs=require('bcryptjs')
///import jsonwebtoken
const jsonwebtoken=require('jsonwebtoken')
//import the express-async-handler
const expressAsyncHandler=require('express-async-handler')
const verifyToken = require('../Middlewares/verifyToken')

let usercollectionObj
let articlecollectionObj
//get the usercollection object to global
UserApp.use((req,res,next)=>{
    usercollectionObj=req.app.get('usercollectionObj')
    articlecollectionObj=req.app.get('articlecollectionObj')
    next()
})

//create the routes
//Registration
UserApp.post('/new-user',expressAsyncHandler(async (req,res)=>{
    //get the data form the request
    let newuser=req.body
    //check the user is dublicate or not
    let dbuser=await usercollectionObj.findOne({username:newuser.username})
    if(dbuser!=null){
        res.send({message:"Username is already taken"})
    }else{
        //hash the password
        let hashedpw=await bcryptjs.hash(newuser.password,6)
        //replace the password
        newuser.password=hashedpw
        //insert the obj into db
        await usercollectionObj.insertOne(newuser)
        //status of the creation
        res.send({message:"User is created"})
    }
}))

//Login
UserApp.post('/login',expressAsyncHandler(async (req,res)=>{
    //get the body
    let usercred=req.body
    //verify the username
    let dbuser=await usercollectionObj.findOne({username:usercred.username})
    if(dbuser==null){
        res.send({message:"Invalid username"})
    }else{
        //compare the password
        let status=await bcryptjs.compare(usercred.password,dbuser.password)
        if(status==false){
            res.send({message:"Invalid password"})
        }else{
            //create the JWT token
            let signedToken=jsonwebtoken.sign({username:dbuser.username},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})
            //send the JWT token
            res.send({message:"Login success",token:signedToken,user:dbuser})
        }
    }
}))

//View Articles of all authors
UserApp.get('/articles',verifyToken,expressAsyncHandler(async (req,res)=>{
    //get all the articles which are in status true
    let allarticles=await articlecollectionObj.find({status:true}).toArray()
    if(allarticles==null){
        res.send({message:"No articles"})
    }else{
        res.send({message:"All articles",payload:allarticles})
    }
}))

//post the comment 
UserApp.post('/comment/:articleId',verifyToken,expressAsyncHandler(async (req,res)=>{
    //get the commentbody
    let commentbody=req.body
    //get the url articleid
    let UrlarticleId=(+req.params.articleId)
    //insert the comment into the article based on the articleId
    await articlecollectionObj.updateOne({articleId:UrlarticleId},{$addToSet:{comments:commentbody}})
    res.send({message:"Comment is added"})
}))


module.exports=UserApp