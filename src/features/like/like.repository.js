import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { productSchema } from "../product/product.schema.js";

import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";
//changed
const LikeModel = mongoose.model('like',likeSchema)
const ProductModel = mongoose.model('product',productSchema)
export class LikeRepository{
    async getLikes(type,id){
        const likes= LikeModel.find({
            likeable: new ObjectId(id),
            //types:type
            on_model:type
        }).populate('user').populate({path:'likeable',model: type})
        
        return await likes
    }
    async likeProduct(userId,productId){
        try{
            const newlike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(productId),
                on_model:'Product'
            })
            // Save the new like to the database
            await newlike.save();
    
            // Optionally, return the created like or some response
            // return newlike;
        }catch (err) {
            console.log(err)
             throw new ApplicationError("Something went wrong with database", 500)
        }
    }
    async likeCategory(userId,categoryId){
        try{
            const newlike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(categoryId),
                on_model:'Category'
            })
            await newlike.save()
        }catch(err) {
            console.log(err)
            throw new ApplicationError("Something went wrong with database", 500)
        }
    }
}
