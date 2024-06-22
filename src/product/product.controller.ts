import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductDTO } from "./DTOs";
import { ProductService } from "./services/product.services";
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

@Controller('/product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get('/')
    getAllProducts() {
        const products = this.productService.getAllProducts();
        return products;
    }

    @Post('/addProduct')
    @UsePipes(ValidationPipe)
    addProduct(@Body() productData: ProductDTO) {
        const newProduct = this.productService.addProduct(productData);
        return { message: "Product Added", product: newProduct };
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
    updateProduct(@Body() product: ProductDTO) {
        if (!product || !product.id) {
            throw new BadRequestException('Product ID is required');
        }

        if (!uuidValidate(product.id) || uuidVersion(product.id) !== 4) {
            throw new BadRequestException('Invalid UUID');
        }

        try {
            const updatedProduct = this.productService.updateProduct(product);
            return { message: "Product Updated", product: updatedProduct };
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Delete('/deleteProduct/:id')
    deleteProductById(@Param('id') id: string) {
        if (!id) {
            throw new BadRequestException('Product ID is required');
        }

        if (!uuidValidate(id) || uuidVersion(id) !== 4) {
            throw new BadRequestException('Invalid UUID version 4');
        }

        try {
            this.productService.deleteProduct(id);
            return { message: "Product Deleted" };
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
}
