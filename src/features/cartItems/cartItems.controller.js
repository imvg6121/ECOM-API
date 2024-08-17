import cartItemModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";

export class CartItemsController{

    constructor(){
        this.cartItemsRepository=new CartItemsRepository()
    }

    async add(req,res){
        try{
        const {productID,quantity} = req.body
        const userID=req.userID
        await this.cartItemsRepository.add(productID,userID,quantity)
        res.status(201).send("Cart is Updated")
        }catch(err){
            return res.status(200).send("Something went wrong");
        }
    }
    async get(req,res){
        try{
        const userID=req.userID
        const items=await this.cartItemsRepository.get(userID)
        return res.status(200).send(items)
        }catch(err){
            return res.status(200).send("Something went wrong");
        }
    }
    async delete(req,res){
        try{
        const userID=req.userID
        const cartItemID=req.params.id
        const isDeleted=this.cartItemsRepository.delete(userID,cartItemID)
        if(!isDeleted){
            return res.status(404).send(error)
        }else{
            return res.status(200).send("Cart Item is removed")
        }
     }catch(err){
        return res.status(200).send("Something went wrong");
    }
    }
}