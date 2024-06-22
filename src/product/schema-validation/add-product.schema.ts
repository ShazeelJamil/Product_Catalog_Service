import * as joi from 'joi'
import { ProductCategory } from '../DTOs/product-catagories'

export const AddProductSchema = joi.object({
    name: joi.string().required(),
    description: joi.string().optional(),
    category: joi.string().required().valid(...Object.keys(ProductCategory)),
    inStocks: joi.number().integer().positive().required(),
    price: joi.number().integer().positive().required()
})