import { ObjectId } from 'mongodb'
import { getDB } from "../../config/mongodb.js"
import { ApplicationError } from "../../error-handler/applicationError.js"
import mongoose from 'mongoose'
import { productSchema } from './product.schema.js'
import { reviewSchema } from './review.schema.js'
import { categorySchema } from './category.schema.js'

const ProductModel = mongoose.model('product', productSchema)
const ReviewModel = mongoose.model('review', reviewSchema)
const CategoryModel = mongoose.model('category',categorySchema)

class ProductRepository {
    constructor() {
        this.collection = "products"
    }
    async add(productData) {
        try {
            //1.Add Product
            productData.categories=productData.category.split(',').map(e=>e.trim())
            console.log(productData)
            const newProduct = new ProductModel(productData)
            const savedProduct = await newProduct.save()

            //2.Update Categories
            await CategoryModel.updateMany(
                {_id:{$in:productData.categories}},
                {
                    $push:{products: new ObjectId(savedProduct._id)}
                }
            )
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500)
        }
    }

    async getAll() {
        try {
            const db = getDB()
            const collection = db.collection(this.collection)
            return await collection.find().toArray()
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500)
        }
    }

    async get(id) {
        try {
            const db = getDB()
            const collection = db.collection(this.collection)
            return await collection.findOne({ _id: new ObjectId(id) })
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500)
        }
    }

    async filter(minPrice, categories) {
        try {
            const db = getDB()
            const collection = db.collection(this.collection)
            let filterExpression = {}
            if (minPrice) {
                filterExpression.price = { $gte: parseFloat(minPrice) }
            }
            categories = JSON.parse(categories.replace(/'/g, '"'))
            console.log(categories)
            if (categories) {
                filterExpression = { $or: [{ category: { $in: categories } }, filterExpression] }
                //filterExpression.category=category
            }
            return collection.find(filterExpression).project({ name: 1, price: 1, _id: 0, ratings: { $slice: 1 } }).toArray()
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500)
        }
    }
    async rate(userID, productID, rating) {
        try {
            //1.Check if product exists
            const productToUpdate = await ProductModel.findById(productID);
            if (!productToUpdate) {
                throw new ApplicationError("Product not found", 404);
            }
            //2.Get the existing review
            const userReview = await ReviewModel.findOne({ product: new ObjectId(productID), user: new ObjectId(userID) })
            if (userReview) {
                //3.Update the review
                userReview.rating = rating
                await userReview.save()
            } else {
                //4.Create a new review
                const newReview = new ReviewModel({
                    product: new ObjectId(productID),
                    user: new ObjectId(userID),
                    rating: rating
                })
                await newReview.save()
            }
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500)
        }
    }
    async averageProductPricePerCategory() {
        try {
            const db = getDB()
            return await db.collection(this.collection)
                .aggregate([
                    {
                        //Stage1:Get Average product price per category
                        $group: {
                            _id: "$category",
                            averagePrice: { $avg: "$price" }
                        }
                    }
                ]).toArray()
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500)
        }
    }
}

export default ProductRepository