import mongoose from "mongoose";
import dotenv from 'dotenv'
import { categorySchema } from "../features/product/category.schema.js";
dotenv.config()

export const connectUsingMongoose = async()=>{
    try{
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log("Connected to mongodb using mongoose")
        addCategories()
    }catch(err){
        console.log("Error in connecting to db")
        console.log(err)
    }
}

async function addCategories(){
    const Category=mongoose.model('Category',categorySchema)
    const categories=await Category.find()
    console.log(categories)
    if(!categories || categories.length==0 ){
        console.log("inside of if condition")
    }
    
    await Category.insertMany([{name: "Books"},{name: "Clothing"},{name: "Electronics"}])
    //[{name: "Books"},{name: "Clothing"},{name: "Electronics"}]
    console.log("Categories are added")
    //console.log("Categories are added")
}