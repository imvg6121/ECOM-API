import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

const UserModel = mongoose.model('User',userSchema)

export default class UserRepository{
    async resetPassword(userID,hashedPassword){
        try{
            let user = await UserModel.findById(userID);
            user.password=hashedPassword
            user.save()
        }catch(err){
            console.log(err)
            throw new ApplicationError("Something went wrong with database",500)
        }
    }

    async signUp(user){
        try{
            //create an instance of model.
            const newUser=new UserModel(user)
            await newUser.save()
            return newUser
        }catch(err){
            console.log(err)
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }else{
                console.log(err)
                throw new ApplicationError("Something went wrong with database",500)
            }
        }
    }

    async signIn(email,password){
        try{
            return await UserModel.findOne({email,password})
        }catch(err){
            console.log(err)
            throw new ApplicationError("Something went wrong with database",500)
        }
    }

    async findByEmail(email){
        try{
        return await UserModel.findOne({email})
        }catch(err){
            throw new ApplicationError("Something went wrong with database",500)
        }
    }
}