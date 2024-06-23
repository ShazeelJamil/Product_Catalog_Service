import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ProductDTO } from '../DTOs';
import { PRODUCT_DOCUMENT, SCHEMA_NAME } from '../product-schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
    constructor(@InjectModel(SCHEMA_NAME) private readonly productDBHandler: Model<PRODUCT_DOCUMENT>) { }

    async addProduct(productData: Partial<ProductDTO>): Promise<ProductDTO> {
        try {
            const productwithId = new ProductDTO(productData)//this lets the object to populate id (uuid4)
            const product = new this.productDBHandler(productwithId);
            const createdProduct = await product.save();
            return createdProduct;
        } catch (error) {
            throw new HttpException('Failed to add product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllProducts(): Promise<ProductDTO[]> {
        try {
            return await this.productDBHandler.find({});
        } catch (error) {
            throw new HttpException('Failed to fetch products', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProductById(id: string): Promise<ProductDTO> {
        try {
            const product = await this.productDBHandler.findOne({ id }).exec();
            if (!product) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }
            return product;
        } catch (error) {
            throw new HttpException('Failed to fetch product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProductByName(name: string): Promise<ProductDTO[]> {
        try {
            const regex = new RegExp(`\\b${name}\\b`, 'i'); // Regex to match whole words, case-insensitive
            const products = await this.productDBHandler.find({ name: { $regex: regex } }).exec();
            if (products.length === 0) {
                throw new NotFoundException(`No products found containing the name "${name}"`);
            }
            return products;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Failed to fetch products by name', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteProduct(id: string): Promise<boolean> {
        try {
            const result = await this.productDBHandler.deleteOne({ id }).exec();
            if (result.deletedCount === 0) {
                throw new NotFoundException(`Product not found`);
            }
            return true;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Failed to delete product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateProduct(updatedProduct: ProductDTO): Promise<ProductDTO> {
        try {
            const existingProduct = await this.productDBHandler.findOne({ id: updatedProduct.id }).exec();
            if (!existingProduct) {
                throw new NotFoundException(`Product not found`);
            }
            Object.assign(existingProduct, updatedProduct);
            await existingProduct.save();
            return existingProduct;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Failed to update product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
