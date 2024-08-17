//import { ApplicationError } from "../../error-handler/applicationError.js";
import ProductModel from "./product.model.js";
import ProductRepository from './product.repository.js';
export default class ProductController{
    constructor(){
        this.productRepository=new ProductRepository()
    }
    async getAllProducts(req,res){
        try{
        const products = await this.productRepository.getAll()
        res.status(200).send(products)
        }catch(err){
            return res.status(200).send("Something went wrong");        }
    }
    async addProduct(req,res){
        try{
        const {name,price,sizes,categories,description} = req.body
        const newProduct = new ProductModel(name,description,parseFloat(price),req?.file?.filename,categories,sizes?.split(','))
        const createdProduct = await this.productRepository.add(newProduct)
        res.status(201).send(createdProduct)
    }catch(err){
        console.log(err)
        return res.status(200).send("Something went wrong");
    }
    }
    async rateProduct(req,res){
        const userID = req.userID
        const productID = req.body.productID
        const rating = req.body.rating
        await this.productRepository.rate(userID,productID,rating)

        return res.status(200).send('Ratings has been added')
    }
    async getOneProduct(req,res){
        try{
            const id = req.params.id
            const product = await this.productRepository.get(id)
            if(!product){
                res.status(404).send("Product Not Found ")
            }else{
                res.status(200).send(product)
            }
            }catch(err){
                return res.status(200).send("Something went wrong");            }
    }
    async filterProducts(req,res){
        try{
        const minPrice = req.query.minPrice
        const categories = req.query.categories
        const result = await this.productRepository.filter(minPrice,categories)
        res.status(200).send(result)
        }catch(err){
            return res.status(200).send("Something went wrong");
        }
    }
    async averagePrice(req,res,next){
        try{
            const result=await this.productRepository.averageProductPricePerCategory()
            res.send(result)
        }catch(err){
            return res.status(200).send("Something went wrong");
        }
    }
}