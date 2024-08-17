//1.Import express
import './env.js'
import express from "express"
import swagger from "swagger-ui-express"
import cors from 'cors'

import productRouter from "./src/features/product/product.routes.js"
import bodyParser from "body-parser"
import userRouter from "./src/features/user/user.routes.js"
import jwtAuth from "./src/middlewares/jwt.middleware.js"
import cartRouter from "./src/features/cartItems/cartItems.routes.js"
import apiDocs from './swagger.json' assert {type:"json"}           
import loggerMiddleware from "./src/middlewares/logger.middleware.js"
import { ApplicationError } from "./src/error-handler/applicationError.js"
import {connectToMongoDB} from "./src/config/mongodb.js"
import orderRouter from './src/features/order/order.routes.js'
import { connectUsingMongoose } from './src/config/mongooseConfig.js'
import mongoose from 'mongoose'
import likeRouter from './src/features/like/like.routes.js'


//2.Create Server
const server = express()

//CORS policy configuration
var corsOptions = {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5500'
};
server.use(cors(corsOptions));


server.use(bodyParser.json())
server.use('/api-docs',swagger.serve,swagger.setup(apiDocs))
server.use(loggerMiddleware)
server.get('/',(req,res)=>{
    res.send("Welcome to Ecommerce APIs")
})

//for all requests related to products send it to product router
server.use('/api/products',jwtAuth,productRouter)
server.use('/api/users',userRouter)
server.use('/api/likes',jwtAuth,likeRouter)
server.use('/api/cartItems',jwtAuth,cartRouter)
server.use('/api/orders',jwtAuth,orderRouter)
server.use((req,res)=>{
    res.status(404).send("API not found.Please check our documentation at localhost:3200/api-docs")
})

//3.default request handler

//Error handler Middleware
server.use((err,req,res,next)=>{
    console.log(err)
    if(err instanceof mongoose.Error.ValidationError){
        res.status(400).send(err.message)
    }
    if(err instanceof ApplicationError){
        res.status(err.code).send(err.message)
    }
    //server errors
    res.status(500).send("Something went wrong. Please try again later")
})

//4.Specify port
const PORT = process.env.PORT || 3200;
server.listen(PORT,()=>{
    console.log("Server is listening on port 3200")
   // connectToMongoDB()
   connectUsingMongoose()
})












