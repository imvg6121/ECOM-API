import mongoose from "mongoose";

// export const userSchema = new mongoose.Schema({
//     name:{type:String,maxLength:[25,"Name Cant be greater than 25 characters"]},
//     email:{type:String,unique:true,required:true,
//         match:[/.+\@.+\../,"Please enter a valid email"]
//     },
//     password:{type:String,
//         validate:{
//             validator:function(value){
//                 return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value)
//             },
//             message:"Password should be between 8 to 12 characters and contain a special character"
//         }
//     },
//     type:{type:String,enum:['Customer','Seller']}
// })import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: [25, "Name cannot be greater than 25 characters"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"] // Custom error message for missing email
    },
    password: {
        type: String,
        required: [true, "Password is required"] // Custom error message for missing password
    },
    type: {
        type: String,
        enum: ['Customer', 'Seller']
    }
});