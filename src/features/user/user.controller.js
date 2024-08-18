import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken'
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt'

export default class UserController{
    constructor(){
        this.userRepository=new UserRepository()
    }
    async resetPassword(req,res){
        const {newPassword} = req.body
        const hashedPassword=await bcrypt.hash(newPassword,12)
        const userID = req.userID
        try{
            await this.userRepository.resetPassword(userID,hashedPassword)
            return res.status(200).send("Password is reset");
        }catch(err){
        return res.status(400).send("Something went wrong");
    }
    }
    // async signUp(req,res,next){
    //     try{
    //         const {name,email,password,type} = req.body
    //         //const hashedPassword=await bcrypt.hash(password,12)
    //         const user =new UserModel(name,email,password,type)
    //         await this.userRepository.signUp(user)
    //         res.status(201).send(user)
    //     }catch(err){
    //         next(err)
    //     }
    // }

    async signUp(req, res, next) {
        try {
            const { name, email, password, type } = req.body;
            
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create a new user object with the hashed password
            const user = new UserModel(name, email, hashedPassword, type);

            // Save the user to the repository
            await this.userRepository.signUp(user);

            // Send a success response
            res.status(201).send(user);
        } catch (err) {
            // Pass the error to the error handling middleware
            next(err);
        }
    }


    // async signIn(req,res){
    //     try{
    //         //1.find user by email
    //     const user=await this.userRepository.findByEmail(req.body.email)
    //     if(!user){
    //         return res.status(400).send("incorrect Credentials")
    //     }else{
    //         //compare password with hashedPassword
    //         const result= await bcrypt.compare(req.body.password,user.password)
    //         if(result){
    //             //1.Create a token
    //         const token = jwt.sign({
    //             userId : user._id,
    //             userEmail : user.email
    //         },
    //         process.env.JWT_SECRET,
    //         {
    //             expiresIn:"1h"
    //         }
    //         )
    //         //2.Send Token
    //         return res.status(200).send(token)
    //         }else{
    //             return res.status(400).send("Incorrect Credentials")
    //         }
    //     }
    // }catch(err){
    //     console.log(err)
    //     return res.status(200).send("Something went wrong")
    // }
    // }


async signIn(req, res) {
    try {
        // 1. Find user by email
        const user = await this.userRepository.findByEmail(req.body.email);
        if (!user) {
            return res.status(400).send("Incorrect credentials");
        }

        // 2. Compare password with hashedPassword
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
            // 3. Create a token
            const token = jwt.sign(
                {
                    userId: user._id,
                    userEmail: user.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );

            // 4. Send Token
            return res.status(200).json({ token });
        } else {
            return res.status(400).send("Incorrect credentials");
        }
    } catch (err) {
        console.error(err); // Use console.error for logging errors
        // return res.status(500).send("Something went wrong"); // Use 500 for server errors
    }
}
}