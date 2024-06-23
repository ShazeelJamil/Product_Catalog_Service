import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ProductDTO } from "./DTOs";
import { ProductService } from "./services/product.services";
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

@Controller('/product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get('/')
    async getAllProducts() {
        try {
            const products = await this.productService.getAllProducts();
            return products;
        } catch (error) {
            throw new HttpException('Failed to fetch products', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/addProduct')
    @UsePipes(ValidationPipe)
    async addProduct(@Body() productData: ProductDTO) {
        try {
            const newProduct = await this.productService.addProduct(productData);
            return { message: "Product Added", product: newProduct };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            }
            throw new HttpException('Failed to add product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/getProductByName/:name')
    getProductByName(@Param('name') name: string) {
        try {
            const product = this.productService.getProductByName(name);
            return product;
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Get('/:id')
    getProductById(@Param('id') id: string) {
        if (!uuidValidate(id) || uuidVersion(id) !== 4) {
            throw new BadRequestException('Invalid UUID');
        }

        try {
            const product = this.productService.getProductById(id);
            return product;
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Put('/updateProduct')
    @UsePipes(ValidationPipe)
    async updateProduct(@Body() product: ProductDTO) {
        if (!product || !product.id) {
            throw new BadRequestException('Product ID is required');
        }
        if (!uuidValidate(product.id) || uuidVersion(product.id) !== 4) {
            throw new BadRequestException('Invalid UUID');
        }

        try {
            const updatedProduct = await this.productService.updateProduct(product);
            return { message: 'Product Updated', product: updatedProduct };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new HttpException('Failed to update product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete('/deleteProduct/:id')
    async deleteProductById(@Param('id') id: string) {
        if (!uuidValidate(id) || uuidVersion(id) !== 4) {
            throw new BadRequestException('Invalid UUID');
        }

        try {
            await this.productService.deleteProduct(id);
            return { message: 'Product Deleted' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new HttpException('Failed to delete product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
